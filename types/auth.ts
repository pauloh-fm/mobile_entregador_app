export interface User {
  id: string;
  name: string;
  email: string;
  deliveryCode: string;
  isActive: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}