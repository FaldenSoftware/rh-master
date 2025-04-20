// src/services/database/index.ts
import { FirestoreService } from './firestoreService';
import { DatabaseConfigValues } from '../../config'; // Usando o valor inicial
import { User as FirebaseAuthUser } from 'firebase/auth'; // Tipo do Firebase Auth

// --- Definições de Tipos Comuns ---
// Estes tipos devem representar os dados da sua aplicação de forma agnóstica
// Adapte conforme a sua estrutura exata.

// Exemplo de tipo unificado para Usuário (combine Firebase e Supabase se necessário)
export interface User extends Partial<FirebaseAuthUser> { // Usando o tipo do Firebase como base
  id: string; // Garantir que sempre tenhamos um ID
  // Adicione outros campos comuns que você usa, ex: email, displayName
  email?: string | null;
  displayName?: string | null;
}

export interface UserProfile {
  id: string; // Geralmente o mesmo que o User ID
  name: string;
  email: string; // Pode ser redundante se já tiver no User
  role: 'mentor' | 'client' | 'admin'; // Use seus papéis
  is_master_account?: boolean;
  created_at: Date | any; // Use Date ou o tipo Timestamp apropriado
  // Campos específicos
  mentor_stats?: {
    client_count: number;
    active_invites: number;
  };
  mentor_id?: string;
}

export interface Client { // Representa um cliente na lista de um mentor
  client_id: string;
  name: string;
  email: string;
  joined_at: Date | any;
  last_test_date?: Date | any | null;
  test_count: number;
  // Adicione mais campos se necessário
}

export interface Invite {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'accepted' | 'expired';
  mentor_id: string;
  mentor_name: string; // Desnormalizado
  email_sent: boolean;
  created_at: Date | any;
  accepted_at?: Date | any | null;
  token: string;
}

export interface TestResult {
  id: string;
  user_id: string;
  client_test_id: string; // Ou apenas test_type: 'animal' | 'proactivity' etc.
  scores: {
    [key: string]: number; // Ex: tubarao: 25, gato: 15 ...
  };
  predominant_profile?: string; // Desnormalizado
  answers?: {
    [key: string]: any; // Respostas das perguntas
  };
  metadata?: {
    completed_at: Date | any;
    duration_seconds?: number;
  };
  created_at: Date | any;
  updated_at?: Date | any;
}

// --- Interface Comum DatabaseService ---
export interface DatabaseService {
  // Métodos de Autenticação
  signIn(email: string, password: string): Promise<User | null>;
  signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<User | null>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>; // Para verificar o estado inicial
  onAuthStateChanged(callback: (user: User | null) => void): () => void; // Listener

  // Métodos para Perfis
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null>;
  // createUserProfile(userId: string, data: UserProfile): Promise<void>; // Pode ser necessário no signUp

  // Métodos para Mentores e Clientes (Exemplos baseados no seu plano)
  getMentorClients(mentorId: string): Promise<Client[]>;
  // addClientToMentor(mentorId: string, clientId: string): Promise<void>; // Considere se isso é feito no perfil ou separadamente

  // Métodos para Convites
  createInvite(inviteData: Omit<Invite, 'id' | 'created_at' | 'accepted_at' | 'email_sent'>): Promise<Invite>; // Passar dados relevantes
  sendInviteEmail(inviteId: string): Promise<void>; // Pode chamar uma Cloud Function ou serviço externo
  getInvitesByMentor(mentorId: string, status?: Invite['status']): Promise<Invite[]>;
  getInviteByToken(token: string): Promise<Invite | null>; // Para aceitar convite
  acceptInvite(inviteId: string, clientId: string): Promise<void>; // Para marcar como aceito

  // Métodos para Resultados de Testes
  saveTestResult(resultData: Omit<TestResult, 'id' | 'created_at' | 'updated_at'>): Promise<string>; // Retorna o ID do novo resultado
  getUserTestResults(userId: string): Promise<TestResult[]>;
  getTestResult(resultId: string): Promise<TestResult | null>;
  // generatePDFFromResultId(resultId: string): Promise<void>; // Adicionar depois se usar Storage/Functions
}

// --- Factory ---
let instance: DatabaseService | null = null;

export function getDatabaseService(): DatabaseService {
  // Singleton para evitar múltiplas instâncias
  if (!instance) {
    console.log("Using Firestore Service"); // Log para depuração
    instance = new FirestoreService();
  }
  return instance;
}
