
import { users } from "./db";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "mentor" | "client";
  company?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Store the current user in localStorage
const AUTH_KEY = "rh-mentor-auth";

// Helper to get the current authenticated user
export const getCurrentUser = (): AuthUser | null => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      return JSON.parse(authData);
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Helper to authenticate a user
export const loginUser = (email: string, password: string): Promise<AuthUser> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Create a sanitized user object (without password)
        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          company: user.company,
        };

        // Save to localStorage
        localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
        resolve(authUser);
      } else {
        reject(new Error("Credenciais inválidas"));
      }
    }, 800);
  });
};

// Helper to log out a user
export const logoutUser = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem(AUTH_KEY);
    resolve();
  });
};

// Check if user has access to a specific route based on role
export const hasAccess = (role: "mentor" | "client" | "any"): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  if (role === "any") return true;
  return user.role === role;
};
