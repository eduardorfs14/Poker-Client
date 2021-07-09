export type User = {
  id: string;
  email: string;
  balance: number;
  avatar_url: string;
}

export type SignInRequestData = {
  email: string;
  password: string
}

export type SignUpRequestData = {
  email: string;
  password: string;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signUp: (data: SignUpRequestData) => Promise<void>
  signIn: (data: SignInRequestData) => Promise<void>
  signOut: () => Promise<void>
}