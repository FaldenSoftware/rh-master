
import { AuthUser, AuthState } from "./authTypes";
import { 
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  devModeLogin,
  updateUserProfile,
  getUserProfile 
} from "./auth";

/**
 * Checks if a user has access based on role
 */
export const hasAccess = (user: AuthUser | null, requiredRole: "mentor" | "client" | "any"): boolean => {
  if (!user) return false;
  
  if (requiredRole === "any") return true;
  
  return user.role === requiredRole;
};

// Re-export everything needed from the auth module
export type { AuthUser, AuthState };
export {
  getUserProfile,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  devModeLogin,
  updateUserProfile
};

