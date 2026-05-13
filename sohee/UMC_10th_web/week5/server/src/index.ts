import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from './prisma';
import { createAccessToken, createRefreshToken, parseDurationToMs, verifyRefreshToken, verifyAccessToken } from './utils';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 8000;
const googleOAuthClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isLocalDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
      const isConfiguredOrigin = origin === process.env.CLIENT_ORIGIN;

      if (isLocalDevOrigin || isConfiguredOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());

const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const createRefreshTokenRecord = async (
  userId: number,
  token: string,
  expiresInMs: number,
) => {
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + expiresInMs),
    },
  });
};

const createAuthResponse = async (userId: number, email: string) => {
  const accessToken = createAccessToken(email);
  const refreshToken = createRefreshToken(email);
  const refreshExpiry = parseDurationToMs(process.env.REFRESH_JWT_EXPIRES_IN ?? '7d');

  await createRefreshTokenRecord(userId, refreshToken, refreshExpiry);

  return { accessToken, refreshToken, userEmail: email };
};

const isAllowedClientOrigin = (origin: string) => {
  return (
    /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) ||
    origin === process.env.CLIENT_ORIGIN
  );
};

app.post('/v1/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return res.json({ id: user.id, email: user.email, message: '회원가입 성공' });
});

app.post('/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
  }

  return res.json(await createAuthResponse(user.id, user.email));
});

app.get('/v1/auth/google', (req, res) => {
  const origin = typeof req.query.origin === 'string' ? req.query.origin : '';
  const clientOrigin = isAllowedClientOrigin(origin)
    ? origin
    : process.env.CLIENT_ORIGIN ?? 'http://localhost:5176';

  const state = Buffer.from(JSON.stringify({ origin: clientOrigin })).toString('base64url');
  const authorizationUrl = googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['openid', 'email', 'profile'],
    state,
  });

  return res.redirect(authorizationUrl);
});

app.get('/v1/auth/google/callback', async (req, res) => {
  const code = typeof req.query.code === 'string' ? req.query.code : null;
  const state = typeof req.query.state === 'string' ? req.query.state : '';

  let clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5176';
  try {
    const parsedState = JSON.parse(Buffer.from(state, 'base64url').toString('utf8')) as {
      origin?: string;
    };
    if (parsedState.origin && isAllowedClientOrigin(parsedState.origin)) {
      clientOrigin = parsedState.origin;
    }
  } catch {
    // Keep the default client origin.
  }

  if (!code) {
    return res.redirect(`${clientOrigin}/login?error=google_oauth_failed`);
  }

  try {
    const { tokens } = await googleOAuthClient.getToken(code);
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: tokens.id_token ?? '',
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googleEmail = ticket.getPayload()?.email;
    if (!googleEmail) {
      return res.redirect(`${clientOrigin}/login?error=google_email_missing`);
    }

    let user = await getUserByEmail(googleEmail);
    if (!user) {
      const hashedPassword = await bcrypt.hash(`google:${googleEmail}`, 10);
      user = await prisma.user.create({
        data: {
          email: googleEmail,
          password: hashedPassword,
        },
      });
    }

    const authResponse = await createAuthResponse(user.id, user.email);
    const params = new URLSearchParams(authResponse);

    return res.redirect(`${clientOrigin}/oauth/google/callback?${params.toString()}`);
  } catch (error) {
    console.log('Google OAuth error', error);
    return res.redirect(`${clientOrigin}/login?error=google_oauth_failed`);
  }
});

app.post('/v1/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required.' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const email = payload.email;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token is invalid or expired.' });
    }

    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked: true },
    });

    const newAccessToken = createAccessToken(user.email);
    const newRefreshToken = createRefreshToken(user.email);
    const refreshExpiry = parseDurationToMs(process.env.REFRESH_JWT_EXPIRES_IN ?? '7d');

    await createRefreshTokenRecord(user.id, newRefreshToken, refreshExpiry);

    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token verification failed.' });
  }
});

app.post('/v1/auth/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required.' });
  }

  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { revoked: true },
  });

  return res.json({ message: 'Logged out successfully.' });
});

app.get('/v1/users/me', async (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorization.replace('Bearer ', '');
  try {
    const payload = verifyAccessToken(token);
    const user = await getUserByEmail(payload.email);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.json({
      status: true,
      message: '내 정보 조회 성공',
      statusCode: 200,
      data: {
        id: user.id,
        email: user.email,
        name: user.email.split('@')[0],
        role: 'USER',
      },
    });
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get('/v1/protected', async (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorization.replace('Bearer ', '');
  try {
    verifyAccessToken(token);
    return res.json({ message: 'Protected data access granted.' });
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(port, () => {
  console.log(`Auth server running on http://localhost:${port}`);
});
