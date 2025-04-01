
export interface Profile {
  id: string;
  name: string;
  role: "mentor" | "client";
  company?: string;
  created_at: string;
  updated_at: string;
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
