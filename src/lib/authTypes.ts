
export type AuthUser = {
  id: string;
  email: string | null;
  name: string;
  role: "mentor" | "client";
  company?: string;
  phone?: string;
  position?: string;
  bio?: string;
  avatar_url?: string;
  createdAt?: string;
  mentor_id?: string;
  cnpj?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  is_master_account?: boolean;
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
