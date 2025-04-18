
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { assignAnimalProfileTestToClient } from "@/lib/animalProfileService";
import { TestData } from "@/types/models";
import { Brain, LineChart } from "lucide-react";

const iconMap = {
  "brain": Brain,
  "heart": Brain,
  "users": Brain,
  "clipboard": Brain,
  "chart": LineChart
};

export const useClientTests = () => {
  const [isStartingTest, setIsStartingTest] = useState<string | null>(null);

  const getDummyTestData = (): TestData[] => {
    return [
      {
        id: "dummy-animal-test-id",
        client_test_id: "dummy-client-test-id",
        title: "Perfil Comportamental",
        description: "Descubra seu perfil comportamental através de nossa metáfora de animais.",
        icon: Brain,
        timeEstimate: "10 minutos",
        status: "pendente",
        category: "comportamental",
        dueDate: "Em aberto",
        startedAt: null,
        completedAt: null
      },
      {
        id: "dummy-egogram-test-id",
        client_test_id: "dummy-egogram-client-test-id",
        title: "Egograma",
        description: "Descubra como se distribuem os estados de ego em sua personalidade.",
        icon: Brain,
        timeEstimate: "10 minutos",
        status: "pendente",
        category: "comportamental",
        dueDate: "Em aberto",
        startedAt: null,
        completedAt: null
      },
      {
        id: "dummy-proactivity-test-id",
        client_test_id: "dummy-proactivity-client-test-id",
        title: "Formulário de Proatividade",
        description: "Avalie seu nível de proatividade e iniciativa no ambiente de trabalho.",
        icon: LineChart,
        timeEstimate: "8 minutos",
        status: "pendente",
        category: "profissional",
        dueDate: "Em aberto",
        startedAt: null,
        completedAt: null
      }
    ];
  };

  const formatTestsData = (clientTests: any[], testsInfo: any[]) => {
    console.log("Formatando dados de testes:", { clientTests, testsInfo });
    const formattedTests: TestData[] = [];
    
    const hasAnimalTest = clientTests.some(test => {
      const testInfo = testsInfo.find(t => t.id === test.test_id);
      return testInfo && testInfo.title === "Perfil Comportamental";
    });
    
    const hasEgogramTest = clientTests.some(test => {
      const testInfo = testsInfo.find(t => t.id === test.test_id);
      return testInfo && testInfo.title === "Egograma";
    });
    
    const hasProactivityTest = clientTests.some(test => {
      const testInfo = testsInfo.find(t => t.id === test.test_id);
      return testInfo && testInfo.title === "Formulário de Proatividade";
    });
    
    if (!hasAnimalTest) {
      formattedTests.push(getDummyTestData()[0]);
    }
    
    if (!hasEgogramTest) {
      formattedTests.push(getDummyTestData()[1]);
    }
    
    if (!hasProactivityTest) {
      formattedTests.push(getDummyTestData()[2]);
    }
    
    clientTests.forEach(test => {
      const testInfo = testsInfo?.find(t => t.id === test.test_id);
      
      if (testInfo) {
        console.log("Processando teste:", { 
          testId: test.id,
          title: testInfo.title,
          isCompleted: test.is_completed,
          completedAt: test.completed_at
        });
        
        const category = "comportamental"; 
        const iconKey = testInfo.title.includes("Proatividade") ? "chart" : "brain";
        
        if (
          testInfo.title !== "Perfil Comportamental" && 
          testInfo.title !== "Egograma" && 
          testInfo.title !== "Formulário de Proatividade"
        ) {
          formattedTests.push({
            id: testInfo.id,
            client_test_id: test.id,
            title: testInfo.title,
            description: testInfo.description || "Teste comportamental para avaliar suas habilidades e perfil profissional.",
            status: test.is_completed ? "concluído" : "pendente",
            timeEstimate: "15 minutos",
            icon: iconMap[iconKey],
            category: category,
            startedAt: test.started_at,
            completedAt: test.completed_at,
            dueDate: test.is_completed ? undefined : "Em aberto",
            completedDate: test.is_completed ? (test.completed_at ? new Date(test.completed_at).toLocaleDateString('pt-BR') : "Data não registrada") : undefined
          });
        }
      }
    });
    
    console.log("Testes formatados:", formattedTests);
    return formattedTests;
  };

  const fetchUserTests = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("Usuário não autenticado");
      }

      await assignAnimalProfileTestToClient(session.user.id);
      
      try {
        console.log("Buscando testes para o usuário:", session.user.id);
        const { data: clientTests, error: clientTestsError } = await supabase
          .from('client_tests')
          .select('*')
          .eq('client_id', session.user.id);
        
        if (clientTestsError) {
          console.error("Erro ao buscar testes do cliente:", clientTestsError);
          return getDummyTestData();
        }
        
        console.log("Testes encontrados:", clientTests?.length || 0);
        
        if (!clientTests || clientTests.length === 0) {
          console.warn("Nenhum teste encontrado para o usuário");
          return getDummyTestData();
        }
        
        const { data: testsInfo, error: testsInfoError } = await supabase
          .from('tests')
          .select('*')
          .in('id', clientTests.map(test => test.test_id));
        
        if (testsInfoError) {
          console.error("Erro ao buscar informações dos testes:", testsInfoError);
          return getDummyTestData();
        }
        
        console.log("Informações de testes encontradas:", testsInfo?.length || 0);
        
        return formatTestsData(clientTests, testsInfo || []);
      } catch (e) {
        console.error("Erro na consulta:", e);
        return getDummyTestData();
      }
    } catch (error) {
      console.error("Erro ao buscar testes:", error);
      return getDummyTestData();
    }
  };

  const { data: testData = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['clientTests'],
    queryFn: fetchUserTests,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  return {
    testData,
    isLoading,
    isError,
    error,
    refetch,
    isStartingTest,
    setIsStartingTest
  };
};
