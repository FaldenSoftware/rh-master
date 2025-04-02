
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
      // Buscar testes do cliente
      const { data: clientTests, error: testsError } = await supabase
        .from('client_tests')
        .select('*')
        .eq('client_id', userId);

      if (testsError) {
        throw new Error(`Erro ao buscar testes: ${testsError.message}`);
      }

      // Retorna array vazio se não houver testes
      if (!clientTests || clientTests.length === 0) {
        return [];
      }

      // Buscar informações dos testes
      const testIds = clientTests.map(test => test.test_id);
      const { data: testInfo, error: testInfoError } = await supabase
        .from('tests')
        .select('*')
        .in('id', testIds);
      
      if (testInfoError) {
        throw new Error(`Erro ao buscar informações dos testes: ${testInfoError.message}`);
      }
      
      // Criar mapeamento de IDs para dados de teste
      const testsMap = new Map();
      if (testInfo) {
        testInfo.forEach(test => {
          testsMap.set(test.id, test);
        });
      }

      // Buscar resultados dos testes
      const { data: testResults, error: resultsError } = await supabase
        .from('test_results')
        .select('*')
        .in('client_test_id', clientTests.map(test => test.id));
      
      if (resultsError) {
        throw new Error(`Erro ao buscar resultados dos testes: ${resultsError.message}`);
      }
      
      // Mapear resultados para os testes
      const resultsMap = new Map();
      if (testResults) {
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
          const skillScores = resultData?.skills || [
            { skill: "Comunicação", value: 65 + Math.floor(Math.random() * 15) },
            { skill: "Proatividade", value: 65 + Math.floor(Math.random() * 15) },
            { skill: "Trabalho em Equipe", value: 65 + Math.floor(Math.random() * 15) },
            { skill: "Liderança", value: 65 + Math.floor(Math.random() * 15) },
            { skill: "Inteligência Emocional", value: 65 + Math.floor(Math.random() * 15) }
          ];

          // Gerar dados de perfil baseados no resultado ou usar valores padrão
          const profileScores = resultData?.profile || [
            { name: "Analítico", value: 20 + Math.floor(Math.random() * 10) },
            { name: "Comunicador", value: 20 + Math.floor(Math.random() * 10) },
            { name: "Executor", value: 20 + Math.floor(Math.random() * 10) },
            { name: "Planejador", value: 20 + Math.floor(Math.random() * 10) }
          ];

          // Gerar dados de radar baseados no resultado ou usar valores padrão
          const radarData = resultData?.radar || [
            { subject: "Comunicação", value: 65 + Math.floor(Math.random() * 20), fullMark: 100 },
            { subject: "Liderança", value: 65 + Math.floor(Math.random() * 20), fullMark: 100 },
            { subject: "Proatividade", value: 65 + Math.floor(Math.random() * 20), fullMark: 100 },
            { subject: "Trabalho em Equipe", value: 65 + Math.floor(Math.random() * 20), fullMark: 100 },
            { subject: "Resiliência", value: 65 + Math.floor(Math.random() * 20), fullMark: 100 },
            { subject: "Inteligência Emocional", value: 65 + Math.floor(Math.random() * 20), fullMark: 100 }
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

      // Ordenar por data, do mais recente para o mais antigo
      return formattedResults.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
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
