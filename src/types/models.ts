export interface Profile {
  id: string;
  name: string;
  role: "mentor" | "client";
  company?: string;
  phone?: string;
  position?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  mentor_id?: string;
  // Company-related fields
  cnpj?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
}

export interface Test {
  id: string;
  title: string;
  description?: string;
  mentor_id: string;
  created_at: string;
  updated_at: string;
}

export interface ClientTest {
  id: string;
  client_id: string;
  test_id: string;
  is_completed: boolean;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos (para quando usarmos .select('*, tests(*)')
  tests?: Test;
}

export interface TestResult {
  id: string;
  client_test_id: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  client_test?: ClientTest;
}

export interface InvitationCode {
  id: string;
  code: string;
  mentor_id: string;
  email: string;
  is_used: boolean;
  used_by?: string;
  created_at: string;
  expires_at: string;
}

export interface TestData {
  id: string;
  client_test_id: string;
  title: string;
  description: string | null;
  icon: any;
  timeEstimate: string;
  status: "pendente" | "concluído";
  category: string;
  dueDate?: string;
  completedDate?: string;
  startedAt?: string | null;
  completedAt?: string | null;
}
