
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientLayout from "@/components/client/ClientLayout";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingTests from "@/components/tests/LoadingTests";
import { TestData } from "@/types/models";
import { useClientTests } from "@/hooks/useClientTests";
import { TestTabContent } from "@/components/tests/TestTabContent";

const ClientTests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    testData,
    isLoading,
    isError,
    error,
    refetch,
    isStartingTest,
    setIsStartingTest
  } = useClientTests();

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

  return (
    <ClientLayout title="Meus Testes">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <TestTabContent
            testData={testData}
            type="pending"
            isStarting={isStartingTest}
            onStartAnimalTest={handleStartAnimalTest}
            onStartEgogramTest={handleStartEgogramTest}
            onStartProactivityTest={handleStartProactivityTest}
            onStartTest={handleStartTest}
            onViewResults={handleViewResults}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <TestTabContent
            testData={testData}
            type="completed"
            isStarting={isStartingTest}
            onStartAnimalTest={handleStartAnimalTest}
            onStartEgogramTest={handleStartEgogramTest}
            onStartProactivityTest={handleStartProactivityTest}
            onStartTest={handleStartTest}
            onViewResults={handleViewResults}
          />
        </TabsContent>
      </Tabs>
    </ClientLayout>
  );
};

export default ClientTests;
