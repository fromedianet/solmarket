export interface User {
  id: string;
  wallet: string;
  displayName: string;
  username: string;
  email: string;
  bio: string;
  emailVerified: boolean;
  isActive: boolean;
  isAdmin: boolean;
}
