
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface TestResult {
  id: string;
  name: string;
  date: string;
  score: number;
  category: string;
  skillScores?: { skill: string; value: number }[];
  profileScores?: { name: string; value: number }[];
  radarData?: { subject: string; value: number; fullMark: number }[];
}

interface TestResultData {
  score?: number;
  skills?: { skill: string; value: number }[];
  profile?: { name: string; value: number }[];
  radar?: { subject: string; value: number; fullMark: number }[];
  category?: string;
}

export const useTestResults = (userId?: string) => {
  const { toast } = useToast();

  const fetchTestResults = async (): Promise<TestResult[]> => {
    if (!userId) {
      return [];
    }

    try {
      // Usar a função RPC segura para buscar testes do cliente
      const { data: clientTests, error: testsError } = await supabase
        .rpc('get_client_tests_for_user', { user_id: userId });

      if (testsError) {
        throw new Error(`Erro ao buscar testes: ${testsError.message}`);
      }

      // Retorna array vazio se não houver testes
      if (!clientTests || clientTests.length === 0) {
        return [];
      }

      // Buscar informações dos testes usando a função RPC
      const testIds = clientTests.map(test => test.test_id);
      const testDataPromises = testIds.map(testId => 
        supabase.rpc('get_test_info', { test_id: testId })
      );
      
      const testDataResults = await Promise.all(testDataPromises);
      
      // Criar mapeamento de IDs para dados de teste
      const testsMap = new Map();
      testDataResults.forEach((result, index) => {
        if (result.data && result.data.length > 0) {
          testsMap.set(testIds[index], result.data[0]);
        }
      });

      // Buscar resultados dos testes usando a função RPC
      const testResultsPromises = clientTests.map(test => 
        supabase.rpc('get_test_results_for_client_test', { client_test_id: test.id })
      );
      
      const testResultsData = await Promise.all(testResultsPromises);
      
      // Mapear resultados para os testes
      const resultsMap = new Map();
      testResultsData.forEach((result, index) => {
        if (result.data && result.data.length > 0) {
          resultsMap.set(clientTests[index].id, result.data[0]);
        }
      });

      // Formatar os dados para o formato esperado pelos componentes
      const formattedResults: TestResult[] = clientTests
        .filter(test => {
          // Filtrar apenas testes com informações completas
          const testInfo = testsMap.get(test.test_id);
          return !!testInfo; // Garantir que temos informações do teste
        })
        .map(test => {
          const testInfo = testsMap.get(test.test_id);
          
          const testDate = test.completed_at 
            ? new Date(test.completed_at).toLocaleDateString('pt-BR')
            : "Data não registrada";
          
          // Obter resultado do teste ou usar valor padrão
          const testResult = resultsMap.get(test.id);
          const resultData = testResult?.data as TestResultData | undefined;
          
          // Se não houver resultado, use valor padrão zero para usuários novos
          const score = resultData?.score !== undefined ? resultData.score : 0;

          // Gerar dados de habilidades baseados no resultado ou usar valores padrão para novos usuários
          const skillScores = resultData?.skills || [
            { skill: "Comunicação", value: 0 },
            { skill: "Proatividade", value: 0 },
            { skill: "Trabalho em Equipe", value: 0 },
            { skill: "Liderança", value: 0 },
            { skill: "Inteligência Emocional", value: 0 }
          ];

          // Gerar dados de perfil baseados no resultado ou usar valores padrão para novos usuários
          const profileScores = resultData?.profile || [
            { name: "Analítico", value: 0 },
            { name: "Comunicador", value: 0 },
            { name: "Executor", value: 0 },
            { name: "Planejador", value: 0 }
          ];

          // Gerar dados de radar baseados no resultado ou usar valores padrão para novos usuários
          const radarData = resultData?.radar || [
            { subject: "Comunicação", value: 0, fullMark: 100 },
            { subject: "Liderança", value: 0, fullMark: 100 },
            { subject: "Proatividade", value: 0, fullMark: 100 },
            { subject: "Trabalho em Equipe", value: 0, fullMark: 100 },
            { subject: "Resiliência", value: 0, fullMark: 100 },
            { subject: "Inteligência Emocional", value: 0, fullMark: 100 }
          ];

          return {
            id: test.id,
            name: testInfo?.title || "Teste",
            date: testDate,
            score: score,
            category: resultData?.category || "comportamental",
            skillScores,
            profileScores,
            radarData
          };
        });

      return formattedResults;
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
      toast({
        title: "Erro ao carregar resultados",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
      return [];
    }
  };

  return useQuery({
    queryKey: ['testResults', userId],
    queryFn: fetchTestResults,
    enabled: !!userId,
  });
};
