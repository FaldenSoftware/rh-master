
import { AuthUser, AuthState } from "./authTypes";
import { getUserProfile } from "./userProfile";
import { 
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} from "./authOperations";

/**
 * Checks if a user has access based on role
 */
export const hasAccess = (user: AuthUser | null, requiredRole: "mentor" | "client" | "any"): boolean => {
  if (!user) return false;
  
  if (requiredRole === "any") return true;
  
  return user.role === requiredRole;
};

// Re-export everything needed from the auth module
export {
  AuthUser,
  AuthState,
  getUserProfile,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
};
