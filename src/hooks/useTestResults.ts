
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
      // Buscar testes concluídos do cliente - modificado para evitar a recursão infinita
      const { data: clientTests, error: testsError } = await supabase
        .from('client_tests')
        .select(`
          id,
          completed_at,
          test_id,
          test_results (
            id,
            data
          )
        `)
        .eq('client_id', userId)
        .eq('is_completed', true);

      if (testsError) {
        throw new Error(`Erro ao buscar testes: ${testsError.message}`);
      }

      // Retorna array vazio se não houver testes
      if (!clientTests || clientTests.length === 0) {
        return [];
      }

      // Buscar informações básicas dos testes separadamente para evitar recursão
      const testIds = clientTests.map(test => test.test_id);
      const { data: testsData, error: testsDataError } = await supabase
        .from('tests')
        .select('id, title, description')
        .in('id', testIds);

      if (testsDataError) {
        throw new Error(`Erro ao buscar informações dos testes: ${testsDataError.message}`);
      }

      // Criar um map para acessar facilmente os dados dos testes
      const testsMap = new Map(testsData?.map(test => [test.id, test]) || []);

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
          
          // Obter resultado do teste com pontuação
          const testResult = test.test_results?.[0]?.data as TestResultData | undefined;
          
          // Se não houver resultado, use valor padrão zero para usuários novos
          const score = testResult?.score !== undefined ? testResult.score : 0;

          // Gerar dados de habilidades baseados no resultado ou usar valores padrão para novos usuários
          const skillScores = testResult?.skills || [
            { skill: "Comunicação", value: 0 },
            { skill: "Proatividade", value: 0 },
            { skill: "Trabalho em Equipe", value: 0 },
            { skill: "Liderança", value: 0 },
            { skill: "Inteligência Emocional", value: 0 }
          ];

          // Gerar dados de perfil baseados no resultado ou usar valores padrão para novos usuários
          const profileScores = testResult?.profile || [
            { name: "Analítico", value: 0 },
            { name: "Comunicador", value: 0 },
            { name: "Executor", value: 0 },
            { name: "Planejador", value: 0 }
          ];

          // Gerar dados de radar baseados no resultado ou usar valores padrão para novos usuários
          const radarData = testResult?.radar || [
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
            category: testResult?.category || "comportamental",
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
