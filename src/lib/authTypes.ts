
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "mentor" | "client";
  company?: string;
  phone?: string;
  position?: string;
  bio?: string;
  avatar_url?: string;
  createdAt: string;
  // Add missing fields that are used in the codebase
  mentor_id?: string;
  cnpj?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
