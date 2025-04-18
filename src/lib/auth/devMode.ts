
import { AuthUser } from "../authTypes";

export const devModeLogin = async (
  email: string,
  name: string,
  role: "mentor" | "client"
): Promise<AuthUser | null> => {
  try {
    // Create a mock user for development mode
    const mockUser: AuthUser = {
      id: `dev-${Date.now()}`,
      email,
      name,
      role,
      company: role === "mentor" ? "Dev Company" : "",
      phone: "",
      position: "",
      bio: "",
      createdAt: new Date().toISOString()
    };

    // Store in localStorage for persistence
    localStorage.setItem('devModeActive', 'true');
    localStorage.setItem('devModeUser', JSON.stringify(mockUser));
    
    console.log("DEV MODE: Logged in as", mockUser);
    
    return mockUser;
  } catch (error) {
    console.error("Error in dev mode login:", error);
    throw error;
  }
};

