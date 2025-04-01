
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

export const useTestResults = (userId?: string) => {
  const { toast } = useToast();

  const fetchTestResults = async (): Promise<TestResult[]> => {
    if (!userId) {
      return [];
    }

    try {
      // Buscar testes concluídos do cliente
      const { data: clientTests, error: testsError } = await supabase
        .from('client_tests')
        .select(`
          id,
          completed_at,
          tests (
            id,
            title,
            description
          ),
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

      if (!clientTests || clientTests.length === 0) {
        return [];
      }

      // Formatar os dados para o formato esperado pelos componentes
      const formattedResults: TestResult[] = clientTests.map((test) => {
        const testDate = test.completed_at 
          ? new Date(test.completed_at).toLocaleDateString('pt-BR')
          : "Data não registrada";
        
        // Obter resultado do teste com pontuação
        const testResult = test.test_results?.[0]?.data;
        const score = testResult?.score || Math.floor(Math.random() * 20) + 70; // Fallback para teste

        // Gerar dados de habilidades baseados no resultado ou dados aleatórios para desenvolvimento
        const skillScores = testResult?.skills || [
          { skill: "Comunicação", value: Math.floor(Math.random() * 30) + 60 },
          { skill: "Proatividade", value: Math.floor(Math.random() * 30) + 60 },
          { skill: "Trabalho em Equipe", value: Math.floor(Math.random() * 30) + 60 },
          { skill: "Liderança", value: Math.floor(Math.random() * 30) + 60 },
          { skill: "Inteligência Emocional", value: Math.floor(Math.random() * 30) + 60 }
        ];

        // Gerar dados de perfil baseados no resultado ou dados aleatórios para desenvolvimento
        const profileScores = testResult?.profile || [
          { name: "Analítico", value: Math.floor(Math.random() * 30) + 50 },
          { name: "Comunicador", value: Math.floor(Math.random() * 30) + 40 },
          { name: "Executor", value: Math.floor(Math.random() * 30) + 30 },
          { name: "Planejador", value: Math.floor(Math.random() * 30) + 60 }
        ];

        // Gerar dados de radar baseados no resultado ou dados aleatórios para desenvolvimento
        const radarData = testResult?.radar || [
          { subject: "Comunicação", value: Math.floor(Math.random() * 30) + 60, fullMark: 100 },
          { subject: "Liderança", value: Math.floor(Math.random() * 30) + 50, fullMark: 100 },
          { subject: "Proatividade", value: Math.floor(Math.random() * 30) + 70, fullMark: 100 },
          { subject: "Trabalho em Equipe", value: Math.floor(Math.random() * 30) + 60, fullMark: 100 },
          { subject: "Resiliência", value: Math.floor(Math.random() * 30) + 60, fullMark: 100 },
          { subject: "Inteligência Emocional", value: Math.floor(Math.random() * 30) + 70, fullMark: 100 }
        ];

        return {
          id: test.id,
          name: test.tests.title,
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
