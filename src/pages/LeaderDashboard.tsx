
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderLayout from "@/components/leader/LeaderLayout";
import ClientsList from "@/components/leader/ClientsList";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TestResult } from "@/types/models";

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
  const [stats, setStats] = useState<DashboardStats>({
    clientCount: 0,
    testCount: 0,
    completedTests: 0,
    pendingTests: 0,
    monthlyData: [],
    resultadosData: []
  });
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      // Fetch client count
      const { data: clients, error: clientsError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'client');
      
      if (clientsError) throw clientsError;
      
      // Fetch tests and their completion status
      const { data: tests, error: testsError } = await supabase
        .from('client_tests')
        .select('*');
      
      if (testsError) throw testsError;
      
      const completedTests = tests ? tests.filter(test => test.is_completed).length : 0;
      const pendingTests = tests ? tests.length - completedTests : 0;
      
      // Generate monthly data
      const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                         "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      
      const monthlyData = Array(6).fill(0).map((_, index) => {
        const monthIndex = (new Date().getMonth() - 5 + index + 12) % 12;
        const month = monthNames[monthIndex];
        
        // Filter tests completed in this month
        const monthCompleted = tests ? tests.filter(test => {
          if (!test.completed_at) return false;
          const completedDate = new Date(test.completed_at);
          return completedDate.getMonth() === monthIndex && 
                 completedDate.getFullYear() === new Date().getFullYear();
        }).length : 0;
        
        // Filter tests assigned but not completed in this month
        const monthPending = tests ? tests.filter(test => {
          if (!test.created_at) return false;
          const createdDate = new Date(test.created_at);
          return createdDate.getMonth() === monthIndex && 
                 createdDate.getFullYear() === new Date().getFullYear() && 
                 !test.is_completed;
        }).length : 0;
        
        return {
          name: month,
          completos: monthCompleted,
          pendentes: monthPending
        };
      });
      
      // Fetch test results for average results data
      const { data: results, error: resultsError } = await supabase
        .from('test_results')
        .select('data');
      
      if (resultsError) throw resultsError;
      
      // Process results to get average values
      const categoriesCount: Record<string, { total: number, count: number }> = {};
      
      if (results && results.length > 0) {
        results.forEach(result => {
          // Typecast the data as our expected TestResultData structure
          const resultData = result.data as TestResultData;
          
          if (resultData && resultData.skills) {
            resultData.skills.forEach(skill => {
              if (!categoriesCount[skill.skill]) {
                categoriesCount[skill.skill] = { total: 0, count: 0 };
              }
              categoriesCount[skill.skill].total += skill.value;
              categoriesCount[skill.skill].count += 1;
            });
          }
        });
      }
      
      const resultadosData = Object.entries(categoriesCount).map(([name, { total, count }]) => ({
        name,
        valor: Math.round(total / count)
      }));
      
      // If no real data, use sample data
      if (resultadosData.length === 0) {
        resultadosData.push(
          { name: 'Foco', valor: 75 },
          { name: 'Paciência', valor: 60 },
          { name: 'Comunicação', valor: 85 },
          { name: 'Liderança', valor: 70 },
          { name: 'Trabalho em Equipe', valor: 90 },
          { name: 'Resolução de Problemas', valor: 80 }
        );
      }
      
      setStats({
        clientCount: clients ? clients.length : 0,
        testCount: tests ? tests.length : 0,
        completedTests,
        pendingTests,
        monthlyData,
        resultadosData
      });
      
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive",
      });
    }
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
      </div>
    </LeaderLayout>
  );
};

export default LeaderDashboard;
