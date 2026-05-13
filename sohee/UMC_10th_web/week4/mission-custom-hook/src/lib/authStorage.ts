import type { AuthSession, RegisteredUser } from '../types/auth';

export type StoredUser = {
  id: number;
  name: string;
};

export const AUTH_STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  currentUser: 'currentUser',
  registeredUser: 'registeredUser',
} as const;

export const toStoredUser = (
  session: AuthSession | RegisteredUser,
): StoredUser => ({
  id: session.id,
  name: session.name,
});
