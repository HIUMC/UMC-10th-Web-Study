import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET ?? 'refresh-secret';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '3600s') as SignOptions['expiresIn'];
const REFRESH_JWT_EXPIRES_IN = (process.env.REFRESH_JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'];

interface JwtPayload {
  email: string;
}

export const createAccessToken = (email: string) => {
  return jwt.sign({ email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const createRefreshToken = (email: string) => {
  return jwt.sign({ email }, REFRESH_JWT_SECRET, {
    expiresIn: REFRESH_JWT_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_JWT_SECRET) as JwtPayload;
};

export const parseDurationToMs = (value: string) => {
  if (value.endsWith('ms')) return Number(value.slice(0, -2));
  if (value.endsWith('s')) return Number(value.slice(0, -1)) * 1000;
  if (value.endsWith('m')) return Number(value.slice(0, -1)) * 60 * 1000;
  if (value.endsWith('h')) return Number(value.slice(0, -1)) * 60 * 60 * 1000;
  if (value.endsWith('d')) return Number(value.slice(0, -1)) * 24 * 60 * 60 * 1000;
  return Number(value);
};
