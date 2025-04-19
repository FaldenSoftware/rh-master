import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Interface para informações do teste
 */
export interface TestInfo {
  id: string;
  title: string;
  description?: string;
  type?: string;
}

/**
 * Interface para informações do cliente de teste
 */
export interface ClientTestInfo {
  id: string;
  client_id?: string;
  test_id?: string;
  is_completed?: boolean;
  test?: TestInfo;
}

/**
 * Interface para informações do usuário
 */
export interface UserInfo {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any; // Para capturar outros campos que possam vir da resposta
}

/**
 * Interface para resultados de testes
 */
export interface TestResult {
  id?: string;
  user_id: string;
  client_test_id: string; // Usando client_test_id em vez de test_id para compatibilidade
  data?: Record<string, any>; // Adicionado para dados flexíveis
  score_tubarao?: number;
  score_gato?: number;
  score_lobo?: number;
  score_aguia?: number;
  answers?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  // Campos para relacionamentos expandidos
  client_test?: ClientTestInfo;
  user?: UserInfo;
}

/**
 * Tipo para a resposta do banco de dados ao selecionar resultados de teste
 */
type DatabaseTestResult = {
  id: string;
  client_test_id: string;
  data: any;
  created_at: string;
  updated_at: string;
  user_id?: string; // Pode estar presente, dependendo da consulta
  client_tests?: {
    id: string;
    client_id: string;
    test_id: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
    started_at?: string;
    completed_at?: string;
    tests?: TestInfo;
  };
  profiles?: UserInfo;
  [key: string]: any; // Para capturar outros campos que possam vir da resposta
};

/**
 * Salva um resultado de teste
 * Se já existir um resultado para o usuário e teste, atualiza o existente
 * Caso contrário, cria um novo registro
 */
export const saveTestResult = async (result: TestResult): Promise<TestResult | null> => {
  try {
    if (!result.user_id || !result.client_test_id) {
      throw new Error("ID do usuário e ID do teste do cliente são obrigatórios");
    }

    // Verificar se já existe um resultado para o usuário e teste
    const { data: existingResults, error: queryError } = await supabase
      .from("test_results")
      .select("*")
      .eq("client_test_id", result.client_test_id)
      .maybeSingle();

    if (queryError) {
      console.error("Erro ao verificar resultados existentes:", queryError);
      throw new Error(`Erro ao verificar resultados existentes: ${queryError.message}`);
    }

    // Preparar dados para inserção/atualização
    const now = new Date().toISOString();
    const testResultData = {
      user_id: result.user_id,
      client_test_id: result.client_test_id,
      data: {
        score_tubarao: result.score_tubarao || 0,
        score_gato: result.score_gato || 0,
        score_lobo: result.score_lobo || 0,
        score_aguia: result.score_aguia || 0,
        answers: result.answers || {},
        metadata: result.metadata || {}
      },
      updated_at: now
    };

    let savedResult: DatabaseTestResult | null = null;

    if (existingResults) {
      // Atualizar resultado existente
      const { data, error } = await supabase
        .from("test_results")
        .update(testResultData)
        .eq("id", existingResults.id)
        .select("*, client_tests!client_test_id(*, tests(*)), profiles!user_id(*)")
        .single();

      if (error) {
        console.error("Erro ao atualizar resultado do teste:", error);
        throw new Error(`Erro ao atualizar resultado do teste: ${error.message}`);
      }

      savedResult = data as DatabaseTestResult;
    } else {
      // Criar novo resultado
      const { data, error } = await supabase
        .from("test_results")
        .insert({
          ...testResultData,
          id: result.id || uuidv4(),
          created_at: now
        })
        .select("*, client_tests!client_test_id(*, tests(*)), profiles!user_id(*)")
        .single();

      if (error) {
        console.error("Erro ao salvar resultado do teste:", error);
        throw new Error(`Erro ao salvar resultado do teste: ${error.message}`);
      }

      savedResult = data as DatabaseTestResult;
    }

    // Formatar resultado para o formato da interface TestResult
    return mapDatabaseResultToTestResult(savedResult);
  } catch (error: any) {
    console.error("Erro no serviço de resultados de testes:", error);
    throw new Error(error.message || "Erro ao salvar resultado do teste");
  }
};

/**
 * Obtém todos os resultados de testes de um usuário
 * Inclui informações dos testes relacionados
 * Ordenados por data de criação (mais recentes primeiro)
 */
export const getUserTestResults = async (userId: string): Promise<TestResult[]> => {
  try {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório");
    }

    const { data, error } = await supabase
      .from("test_results")
      .select(`
        id, client_test_id, user_id, data, created_at,
        client_tests!inner( id, is_completed, test_id, tests( id, title, type ) ),
        profiles!inner( id, email, full_name )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar resultados de testes:", error);
      throw new Error(`Erro ao buscar resultados de testes: ${error.message}`);
    }

    // Mapear resultados para o formato da interface TestResult
    return (data || []).map((item: any) => mapDatabaseResultToTestResult(item));
  } catch (error: any) {
    console.error("Erro no serviço de resultados de testes:", error);
    throw new Error(error.message || "Erro ao buscar resultados de testes");
  }
};

/**
 * Obtém um resultado específico de teste
 * Inclui informações do teste e do usuário
 */
export const getTestResult = async (resultId: string): Promise<TestResult | null> => {
  try {
    if (!resultId) {
      throw new Error("ID do resultado é obrigatório");
    }

    const { data, error } = await supabase
      .from("test_results")
      .select("*, client_tests!client_test_id(*, tests(*)), profiles!user_id(*)")
      .eq("id", resultId)
      .single();

    if (error) {
      if (error.code === "PGRST116") { // Código para "não encontrado"
        return null;
      }
      console.error("Erro ao buscar resultado do teste:", error);
      throw new Error(`Erro ao buscar resultado do teste: ${error.message}`);
    }

    // Mapear resultado para o formato da interface TestResult
    return data ? mapDatabaseResultToTestResult(data as any) : null;
  } catch (error: any) {
    console.error("Erro no serviço de resultados de testes:", error);
    throw new Error(error.message || "Erro ao buscar resultado do teste");
  }
};

/**
 * Função auxiliar para mapear o resultado do banco de dados para o formato da interface TestResult
 */
function mapDatabaseResultToTestResult(dbResult: DatabaseTestResult): TestResult {
  if (!dbResult) return null as any;

  const { data, client_tests, profiles, ...rest } = dbResult;

  // Garantir que user_id esteja presente
  const user_id = rest.user_id || (profiles?.id || "");

  const result: TestResult = {
    ...rest,
    user_id,
    client_test_id: rest.client_test_id,
    score_tubarao: data?.score_tubarao || 0,
    score_gato: data?.score_gato || 0,
    score_lobo: data?.score_lobo || 0,
    score_aguia: data?.score_aguia || 0,
    answers: data?.answers || {},
    metadata: data?.metadata || {},
    client_test: client_tests ? {
      id: client_tests.id,
      client_id: client_tests.client_id,
      test_id: client_tests.test_id,
      is_completed: client_tests.is_completed,
      test: client_tests.tests ? {
        id: client_tests.tests.id,
        title: client_tests.tests.title,
        description: client_tests.tests.description,
        type: client_tests.tests.type
      } : undefined
    } : undefined,
    user: profiles ? {
      id: profiles.id,
      name: profiles.name,
      email: profiles.email
    } : undefined
  };

  return result;
}
