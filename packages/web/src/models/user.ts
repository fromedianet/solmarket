export interface User {
  wallet: string;
  displayName: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  emailVerified: boolean;
  isActive: boolean;
  isAdmin: boolean;
}
