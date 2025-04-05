import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getClientTestsForUser, getTestInfoBatch, getTestResultsBatch } from "@/lib/batchQueries";

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
      return getDefaultTestResults();
    }

    try {
      // Buscar testes do cliente usando a função segura
      const clientTests = await getClientTestsForUser(userId);

      // Retorna array vazio se não houver testes
      if (!clientTests || clientTests.length === 0) {
        return getDefaultTestResults();
      }

      // Buscar informações dos testes
      const testIds = clientTests.map(test => test.test_id);
      const testInfo = await getTestInfoBatch(testIds);
      
      // Criar mapeamento de IDs para dados de teste
      const testsMap = new Map();
      if (testInfo && testInfo.length > 0) {
        testInfo.forEach(test => {
          testsMap.set(test.id, test);
        });
      }

      // Buscar resultados dos testes
      const clientTestIds = clientTests.map(test => test.id);
      const testResults = await getTestResultsBatch(clientTestIds);
      
      // Mapear resultados para os testes
      const resultsMap = new Map();
      if (testResults && testResults.length > 0) {
        testResults.forEach(result => {
          resultsMap.set(result.client_test_id, result);
        });
      }

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
          
          // Se não houver resultado, use valores padrão
          const score = resultData?.score !== undefined ? resultData.score : 0;

          // Gerar dados de habilidades baseados no resultado ou usar valores padrão
          const skillScores = resultData?.skills || getDefaultSkillScores();

          // Gerar dados de perfil baseados no resultado ou usar valores padrão
          const profileScores = resultData?.profile || getDefaultProfileScores();

          // Gerar dados de radar baseados no resultado ou usar valores padrão
          const radarData = resultData?.radar || getDefaultRadarData();

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

      // Ordenar por data, do mais recente para o mais antigo
      return formattedResults.length > 0 ? 
        formattedResults.sort((a, b) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        }) : 
        getDefaultTestResults();
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
      toast({
        title: "Erro ao carregar resultados",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
      return getDefaultTestResults();
    }
  };

  return useQuery({
    queryKey: ['testResults', userId],
    queryFn: fetchTestResults,
    enabled: !!userId,
  });
};

const getDefaultSkillScores = () => [
  { skill: "Comunicação", value: 0 },
  { skill: "Proatividade", value: 0 },
  { skill: "Trabalho em Equipe", value: 0 },
  { skill: "Liderança", value: 0 },
  { skill: "Inteligência Emocional", value: 0 }
];

const getDefaultProfileScores = () => [
  { name: "Analítico", value: 0 },
  { name: "Comunicador", value: 0 },
  { name: "Executor", value: 0 },
  { name: "Planejador", value: 0 }
];

const getDefaultRadarData = () => [
  { subject: "Comunicação", value: 0, fullMark: 100 },
  { subject: "Liderança", value: 0, fullMark: 100 },
  { subject: "Proatividade", value: 0, fullMark: 100 },
  { subject: "Trabalho em Equipe", value: 0, fullMark: 100 },
  { subject: "Resiliência", value: 0, fullMark: 100 },
  { subject: "Inteligência Emocional", value: 0, fullMark: 100 }
];

const getDefaultTestResults = (): TestResult[] => {
  return []; // Return empty array to indicate no tests completed
};
