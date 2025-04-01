
// Simple in-memory database for demo purposes
// In a real app, this would be replaced with a proper backend service

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "mentor" | "client";
  company?: string;
}

// Mock users database
export const users: User[] = [
  {
    id: "mentor-1",
    email: "admin",
    password: "admin1234",
    name: "Admin Mentor",
    role: "mentor"
  },
  {
    id: "client-1",
    email: "teste",
    password: "teste1234",
    name: "João Silva",
    role: "client",
    company: "Empresa ABC Ltda"
  }
];

// More database related functions can be added here
