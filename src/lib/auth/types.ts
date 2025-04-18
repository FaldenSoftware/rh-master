
import { AuthUser } from "../authTypes";

export type UserRegistrationData = {
  email: string;
  password: string;
  name: string;
  role: "mentor" | "client";
  company?: string;
  phone?: string;
  position?: string;
  bio?: string;
};

