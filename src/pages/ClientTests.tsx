import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, LineChart } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AnimalProfileTestCard from "@/components/tests/AnimalProfileTestCard";
import EgogramaTestCard from "@/components/tests/EgogramaTestCard";
import ProactivityTestCard from "@/components/tests/ProactivityTestCard";
import GenericTestCard from "@/components/tests/GenericTestCard";
import LoadingTests from "@/components/tests/LoadingTests";
import EmptyTestState from "@/components/tests/EmptyTestState";
import { assignAnimalProfileTestToClient } from "@/lib/animalProfileService";
import { TestData } from "@/types/models";

const iconMap = {
  "brain": Brain,
  "heart": Brain,
  "users": Brain,
  "clipboard": Brain,
  "chart": LineChart
};

const ClientTests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isStartingTest, setIsStartingTest] = useState<string | null>(null);

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
      formattedTests.push({
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
      });
    }
    
    if (!hasEgogramTest) {
      formattedTests.push({
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
      });
    }
    
    if (!hasProactivityTest) {
      formattedTests.push({
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
      });
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

  const { data: testData = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['clientTests'],
    queryFn: fetchUserTests,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Erro ao carregar testes",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  const handleStartTest = async (test: TestData) => {
    setIsStartingTest(test.client_test_id);
    
    try {
      if (test.title === "Perfil Comportamental") {
        navigate('/client/tests/animal-profile');
        return;
      }
      
      if (test.title === "Egograma") {
        navigate('/client/tests/egograma');
        return;
      }
      
      if (test.title === "Formulário de Proatividade") {
        navigate('/client/tests/proactivity');
        return;
      }
      
      const { error } = await supabase
        .from('client_tests')
        .update({
          started_at: new Date().toISOString()
        })
        .eq('id', test.client_test_id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Teste iniciado",
        description: "Você será redirecionado para o teste em breve.",
      });
      
      refetch();
      
      setTimeout(() => {
        toast({
          title: "Página em desenvolvimento",
          description: "A página do teste ainda está sendo implementada.",
        });
        setIsStartingTest(null);
      }, 1500);
    } catch (error) {
      console.error("Erro ao iniciar teste:", error);
      toast({
        title: "Erro ao iniciar teste",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
      setIsStartingTest(null);
    }
  };

  const handleStartAnimalTest = (testId: string) => {
    setIsStartingTest(testId);
    navigate('/client/tests/animal-profile');
  };

  const handleStartEgogramTest = (testId: string) => {
    setIsStartingTest(testId);
    navigate('/client/tests/egograma');
  };

  const handleStartProactivityTest = (testId: string) => {
    setIsStartingTest(testId);
    navigate('/client/tests/proactivity');
  };

  const handleViewResults = (testId: string) => {
    console.log(`Visualizando resultados do teste ${testId}`);
    toast({
      title: "Carregando resultados",
      description: "Os resultados do teste serão exibidos em breve.",
    });
    navigate(`/client/profile`);
  };

  if (isLoading) {
    return (
      <ClientLayout title="Meus Testes">
        <LoadingTests />
      </ClientLayout>
    );
  }

  const animalTest = testData.find(test => test.title === "Perfil Comportamental");
  const egogramTest = testData.find(test => test.title === "Egograma");
  const proactivityTest = testData.find(test => test.title === "Formulário de Proatividade");
  
  if (!animalTest) {
    testData.unshift({
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
    });
  }
  
  if (!egogramTest) {
    testData.push({
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
    });
  }
  
  if (!proactivityTest) {
    testData.push({
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
    });
  }

  return (
    <ClientLayout title="Meus Testes">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {testData.filter(test => test.status === "pendente").length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {animalTest && animalTest.status === "pendente" && (
                <AnimalProfileTestCard
                  test={{
                    id: animalTest.client_test_id,
                    client_id: '',
                    test_id: animalTest.id,
                    is_completed: false,
                    started_at: animalTest.startedAt,
                    completed_at: animalTest.completedAt,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }}
                  isStarting={isStartingTest === animalTest.client_test_id}
                  onStartTest={handleStartAnimalTest}
                />
              )}
              
              {egogramTest && egogramTest.status === "pendente" && (
                <EgogramaTestCard
                  test={{
                    id: egogramTest.client_test_id,
                    client_id: '',
                    test_id: egogramTest.id,
                    is_completed: false,
                    started_at: egogramTest.startedAt,
                    completed_at: egogramTest.completedAt,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }}
                  isStarting={isStartingTest === egogramTest.client_test_id}
                  onStartTest={handleStartEgogramTest}
                />
              )}
              
              {proactivityTest && proactivityTest.status === "pendente" && (
                <ProactivityTestCard
                  test={{
                    id: proactivityTest.client_test_id,
                    client_id: '',
                    test_id: proactivityTest.id,
                    is_completed: false,
                    started_at: proactivityTest.startedAt,
                    completed_at: proactivityTest.completedAt,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }}
                  isStarting={isStartingTest === proactivityTest.client_test_id}
                  onStartTest={handleStartProactivityTest}
                />
              )}
              
              {testData
                .filter(test => test.status === "pendente" && 
                       test.title !== "Perfil Comportamental" && 
                       test.title !== "Egograma" && 
                       test.title !== "Formulário de Proatividade")
                .map((test) => (
                  <GenericTestCard
                    key={test.client_test_id}
                    test={test}
                    isStarting={isStartingTest === test.client_test_id}
                    onStartTest={handleStartTest}
                    onViewResults={handleViewResults}
                  />
                ))}
            </div>
          ) : (
            <EmptyTestState type="pending" />
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {testData.filter(test => test.status === "concluído").length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {animalTest && animalTest.status === "concluído" && (
                <AnimalProfileTestCard
                  test={{
                    id: animalTest.client_test_id,
                    client_id: '',
                    test_id: animalTest.id,
                    is_completed: true,
                    started_at: animalTest.startedAt,
                    completed_at: animalTest.completedAt,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }}
                  isStarting={false}
                  onStartTest={handleStartAnimalTest}
                />
              )}
              
              {egogramTest && egogramTest.status === "concluído" && (
                <EgogramaTestCard
                  test={{
                    id: egogramTest.client_test_id,
                    client_id: '',
                    test_id: egogramTest.id,
                    is_completed: true,
                    started_at: egogramTest.startedAt,
                    completed_at: egogramTest.completedAt,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }}
                  isStarting={false}
                  onStartTest={handleStartEgogramTest}
                />
              )}
              
              {proactivityTest && proactivityTest.status === "concluído" && (
                <ProactivityTestCard
                  test={{
                    id: proactivityTest.client_test_id,
                    client_id: '',
                    test_id: proactivityTest.id,
                    is_completed: true,
                    started_at: proactivityTest.startedAt,
                    completed_at: proactivityTest.completedAt,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }}
                  isStarting={false}
                  onStartTest={handleStartProactivityTest}
                />
              )}
              
              {testData
                .filter(test => test.status === "concluído" && 
                       test.title !== "Perfil Comportamental" && 
                       test.title !== "Egograma" && 
                       test.title !== "Formulário de Proatividade")
                .map((test) => (
                  <GenericTestCard
                    key={test.client_test_id}
                    test={test}
                    isStarting={isStartingTest === test.client_test_id}
                    onStartTest={handleStartTest}
                    onViewResults={handleViewResults}
                  />
                ))}
            </div>
          ) : (
            <EmptyTestState type="completed" />
          )}
        </TabsContent>
      </Tabs>
    </ClientLayout>
  );
};

export default ClientTests;
