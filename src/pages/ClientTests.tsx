
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, Clock, CheckCircle, Brain, Users, Loader2 } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AnimalProfileTestCard from "@/components/tests/AnimalProfileTestCard";
import { ClientTest } from "@/types/models";
import { assignAnimalProfileTestToClient } from "@/lib/animalProfileService";

interface TestData {
  id: string;
  client_test_id: string;
  title: string;
  description: string | null;
  icon: any;
  timeEstimate: string;
  status: "pendente" | "concluído";
  category: string;
  dueDate?: string;
  completedDate?: string;
  startedAt?: string | null;
  completedAt?: string | null;
}

const iconMap: Record<string, any> = {
  "brain": Brain,
  "heart": Heart,
  "users": Users,
  "clipboard": ClipboardCheck,
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

      // Garantir que o teste de perfil animal esteja atribuído ao cliente
      await assignAnimalProfileTestToClient(session.user.id);
      
      // Buscar os testes do cliente
      try {
        const { data: clientTests, error: clientTestsError } = await supabase
          .from('client_tests')
          .select('*')
          .eq('client_id', session.user.id);
        
        if (clientTestsError) {
          console.error("Erro ao buscar testes do cliente:", clientTestsError);
          return getDummyTestData(); // Retornar dados fictícios em caso de erro
        }
        
        if (!clientTests || clientTests.length === 0) {
          console.warn("Nenhum teste encontrado para o usuário");
          return getDummyTestData();
        }
        
        // Buscar informações dos testes
        const { data: testsInfo, error: testsInfoError } = await supabase
          .from('tests')
          .select('*')
          .in('id', clientTests.map(test => test.test_id));
        
        if (testsInfoError) {
          console.error("Erro ao buscar informações dos testes:", testsInfoError);
          return getDummyTestData();
        }
        
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
  
  // Função para dados fictícios em caso de falha
  const getDummyTestData = (): TestData[] => {
    return [
      {
        id: "dummy-animal-test-id",
        client_test_id: "dummy-client-test-id",
        title: "Teste de Perfil - Animais",
        description: "Descubra seu perfil comportamental através de nossa metáfora de animais.",
        icon: Brain,
        timeEstimate: "10 minutos",
        status: "pendente",
        category: "comportamental",
        dueDate: "Em aberto",
        startedAt: null,
        completedAt: null
      }
    ];
  };
  
  // Function to format test data
  const formatTestsData = (clientTests: any[], testsInfo: any[]) => {
    const formattedTests: TestData[] = [];
    
    // Verificar se existe o teste de perfil animal
    const hasAnimalTest = clientTests.some(test => {
      const testInfo = testsInfo.find(t => t.id === test.test_id);
      return testInfo && testInfo.title === "Teste de Perfil - Animais";
    });
    
    // Se não existir, adicionar manualmente
    if (!hasAnimalTest) {
      formattedTests.push({
        id: "dummy-animal-test-id",
        client_test_id: "dummy-client-test-id",
        title: "Teste de Perfil - Animais",
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
    
    clientTests.forEach(test => {
      const testInfo = testsInfo?.find(t => t.id === test.test_id);
      
      if (testInfo) {
        const category = "comportamental"; 
        const iconKey = category === "comportamental" ? "brain" : "clipboard";
        
        formattedTests.push({
          id: testInfo.id,
          client_test_id: test.id,
          title: testInfo.title,
          description: testInfo.description || "Teste comportamental para avaliar suas habilidades e perfil profissional.",
          status: test.is_completed ? "concluído" : "pendente",
          timeEstimate: testInfo.title.includes("Animal") ? "10 minutos" : "20 minutos",
          icon: iconMap[iconKey],
          category: category,
          startedAt: test.started_at,
          completedAt: test.completed_at,
          dueDate: test.is_completed ? undefined : "Em aberto",
          completedDate: test.is_completed ? (test.completed_at ? new Date(test.completed_at).toLocaleDateString('pt-BR') : "Data não registrada") : undefined
        });
      }
    });
    
    return formattedTests;
  };

  const { data: testData = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['clientTests'],
    queryFn: fetchUserTests,
    retry: 1,
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
      if (test.title === "Teste de Perfil - Animais") {
        navigate('/client/tests/animal-profile');
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
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-muted-foreground">Carregando seus testes...</p>
        </div>
      </ClientLayout>
    );
  }

  // Garantir que sempre temos o teste de perfil animal
  const animalTest = testData.find(test => test.title === "Teste de Perfil - Animais");
  if (!animalTest) {
    testData.unshift({
      id: "dummy-animal-test-id",
      client_test_id: "dummy-client-test-id",
      title: "Teste de Perfil - Animais",
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
              
              {testData
                .filter(test => test.status === "pendente" && test.title !== "Teste de Perfil - Animais")
                .map((test) => (
                  <Card key={test.client_test_id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 pb-4">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                          Pendente
                        </Badge>
                        <div className="flex items-center text-amber-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-xs">Prazo: {test.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mt-3">
                        <div className="bg-purple-100 p-2 rounded-md">
                          <test.icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{test.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {test.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">
                              {test.startedAt ? "Iniciado" : "0%"}
                            </span>
                          </div>
                          <Progress value={test.startedAt ? 30 : 0} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Tempo estimado: {test.timeEstimate}</span>
                          </div>
                          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                            {test.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 py-3">
                      <Button 
                        className="w-full" 
                        onClick={() => handleStartTest(test)}
                        disabled={isStartingTest === test.client_test_id}
                      >
                        {isStartingTest === test.client_test_id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Iniciando...
                          </>
                        ) : test.startedAt ? "Continuar Teste" : "Iniciar Teste"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
                <ClipboardCheck className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhum teste pendente</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Você não tem nenhum teste pendente no momento. Todos os seus testes
                serão exibidos aqui quando estiverem disponíveis.
              </p>
            </div>
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
              
              {testData
                .filter(test => test.status === "concluído" && test.title !== "Teste de Perfil - Animais")
                .map((test) => (
                  <Card key={test.client_test_id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 pb-4">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Concluído
                        </Badge>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Realizado: {test.completedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mt-3">
                        <div className="bg-purple-100 p-2 rounded-md">
                          <test.icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{test.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {test.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">100%</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Tempo estimado: {test.timeEstimate}</span>
                          </div>
                          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                            {test.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 py-3">
                      <Button variant="outline" className="w-full" onClick={() => handleViewResults(test.id)}>
                        Ver Resultados
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
                <CheckCircle className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhum teste concluído</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Você ainda não concluiu nenhum teste. Após concluir seus testes, 
                eles serão exibidos aqui com seus resultados.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ClientLayout>
  );
};

export default ClientTests;
