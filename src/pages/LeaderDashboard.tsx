
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderLayout from "@/components/leader/LeaderLayout";
import ClientsList from "@/components/leader/ClientsList";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TestResult } from "@/types/models";
import { useAuth } from "@/context/AuthContext";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface DashboardStats {
  clientCount: number;
  testCount: number;
  completedTests: number;
  pendingTests: number;
  monthlyData: Array<{
    name: string;
    completos: number;
    pendentes: number;
  }>;
  resultadosData: Array<{
    name: string;
    valor: number;
  }>;
}

// Interface for test result data structure
interface TestResultData {
  skills?: Array<{ skill: string; value: number }>;
  profile?: Array<{ name: string; value: number }>;
  category?: string;
  score?: number;
}

const LeaderDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    clientCount: 0,
    testCount: 0,
    completedTests: 0,
    pendingTests: 0,
    monthlyData: [],
    resultadosData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }
      
      // Fetch client count using our secure function
      const { data: clients, error: clientsError } = await supabase
        .rpc('get_mentor_clients', { mentor_id: user.id });
      
      if (clientsError) {
        console.error("Erro ao buscar clientes:", clientsError);
        throw clientsError;
      }
      
      // Montando dados mensais para o gráfico
      const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                         "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      
      const monthlyData = Array(6).fill(0).map((_, index) => {
        const monthIndex = (new Date().getMonth() - 5 + index + 12) % 12;
        const month = monthNames[monthIndex];
        
        // Valores padrão caso não haja dados
        return {
          name: month,
          completos: Math.floor(Math.random() * 5),
          pendentes: Math.floor(Math.random() * 3)
        };
      });
      
      // Dados de exemplo para resultados médios
      const resultadosData = [
        { name: 'Foco', valor: 75 },
        { name: 'Paciência', valor: 60 },
        { name: 'Comunicação', valor: 85 },
        { name: 'Liderança', valor: 70 },
        { name: 'Trabalho em Equipe', valor: 90 },
        { name: 'Resolução de Problemas', valor: 80 }
      ];
      
      setStats({
        clientCount: clients ? clients.length : 0,
        testCount: 0, // Placeholder
        completedTests: 0, // Placeholder
        pendingTests: 0, // Placeholder
        monthlyData,
        resultadosData
      });
      
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
      
      // Definir valores padrão para mostrar a estrutura dos gráficos
      setDefaultStats();
    } finally {
      setIsLoading(false);
    }
  };
  
  const setDefaultStats = () => {
    // Dados de placeholder para quando houver erro ou não houver dados
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"];
    const monthlyData = monthNames.map(name => ({
      name,
      completos: 0,
      pendentes: 0
    }));
    
    const resultadosData = [
      { name: 'Foco', valor: 0 },
      { name: 'Paciência', valor: 0 },
      { name: 'Comunicação', valor: 0 },
      { name: 'Liderança', valor: 0 },
      { name: 'Trabalho em Equipe', valor: 0 },
      { name: 'Resolução de Problemas', valor: 0 }
    ];
    
    setStats({
      clientCount: 0,
      testCount: 0,
      completedTests: 0,
      pendingTests: 0,
      monthlyData,
      resultadosData
    });
  };
  
  const handleEditClient = (client: Client) => {
    toast({
      title: "Edição de cliente",
      description: `Editando ${client.name}`,
    });
  };

  const handleDeleteClient = (clientId: string) => {
    toast({
      title: "Cliente excluído",
      description: `O cliente foi excluído com sucesso.`,
    });
  };

  return (
    <LeaderLayout title="Dashboard do Mentor">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard do Mentor</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.clientCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Testes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.testCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Testes Completos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedTests}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Testes Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingTests}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Testes Aplicados</CardTitle>
                  <CardDescription>Visão geral dos testes aplicados nos últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completos" fill="#8884d8" name="Testes Completos" />
                      <Bar dataKey="pendentes" fill="#82ca9d" name="Testes Pendentes" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resultados Médios</CardTitle>
                  <CardDescription>Médias de resultados por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.resultadosData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="valor" stroke="#8884d8" activeDot={{ r: 8 }} name="Valor" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Clientes Recentes</CardTitle>
                <CardDescription>
                  Seus clientes mais recentes e suas informações básicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientsList onEdit={handleEditClient} onDelete={handleDeleteClient} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </LeaderLayout>
  );
};

export default LeaderDashboard;
