
import { AuthUser } from "./authTypes";

/**
 * Checks if a user has access based on role
 */
export const hasAccess = (user: AuthUser | null, requiredRole: "mentor" | "client" | "any"): boolean => {
  if (!user) return false;
  
  if (requiredRole === "any") return true;
  
  return user.role === requiredRole;
};

// Export types
export type { AuthUser };

// Re-export everything from auth module
export * from "./auth/types";
export * from "./auth/authentication";
export * from "./auth/registration";
export * from "./auth/userProfile";
