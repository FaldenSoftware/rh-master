export interface DatabaseConfig {
  useFirestore: boolean;
  // Adicione outras configurações globais aqui, se necessário
}

// Defina aqui qual banco de dados usar por padrão ou carregue de variáveis de ambiente
export const DatabaseConfigValues: DatabaseConfig = {
  // Mude para true quando quiser usar o Firestore por padrão
  useFirestore: true,
};

// Você também pode adicionar configurações específicas do Firebase e Supabase aqui
// se não quiser mantê-las separadas

export const FirebaseConfig = {
  // As credenciais do firebaseConfig poderiam vir de variáveis de ambiente
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // ...
};

// Feature flags (como você sugeriu)
export interface FeatureFlags {
  useFirestore: boolean;
  useFirebaseAuth: boolean;
  // useFirebaseFunctions: boolean; // Adicionar depois se necessário
  // useFirebaseStorage: boolean; // Adicionar depois se necessário
}

// Valores padrão das feature flags (podem ser carregados dinamicamente)
export const defaultFeatureFlags: FeatureFlags = {
  useFirestore: true, // Começamos com Firestore
  useFirebaseAuth: false, // Começamos com Supabase Auth
};

// Idealmente, carregaríamos isso de forma assíncrona
// mas para simplificar agora, podemos usar os valores padrão
export function getFeatureFlags(): FeatureFlags {
  // Aqui você poderia adicionar lógica para carregar de localStorage,
  // uma API de configuração, ou do Firestore futuramente
  return defaultFeatureFlags;
}
