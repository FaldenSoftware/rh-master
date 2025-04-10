
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, Users, BookOpen, Award, Clock, ChevronRight } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getMentorClients } from "@/lib/batchQueries";

const defaultActivityData = [
  { name: "Seg", tests: 0 },
  { name: "Ter", tests: 0 },
  { name: "Qua", tests: 0 },
  { name: "Qui", tests: 0 },
  { name: "Sex", tests: 0 },
  { name: "Sáb", tests: 0 },
  { name: "Dom", tests: 0 },
];

const defaultCompletionData = [
  { name: "Comportamental", completed: 0, incomplete: 0 },
  { name: "Habilidades", completed: 0, incomplete: 0 },
  { name: "Conhecimento", completed: 0, incomplete: 0 },
];

interface Client {
  id: string;
  name: string;
  email?: string;
  company?: string;
  created_at: string;
}

const LeaderDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [activityData, setActivityData] = useState(defaultActivityData);
  const [completionData, setCompletionData] = useState(defaultCompletionData);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalClients: 0,
    activeTests: 0,
    completedTests: 0,
    avgScore: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }
      
      // Fetch clients
      const clientsData = await getMentorClients(user.id);

      if (Array.isArray(clientsData)) {
        // Sort by creation date (newest first)
        const sortedClients = [...clientsData].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 5);
        
        setClients(sortedClients);
        
        // Update statistics
        setStatistics(prev => ({
          ...prev,
          totalClients: clientsData.length
        }));
      }

      // Fetch real tests data from database
      // For now, we'll use empty data for new mentors
      
      // Use default empty activity data (all zeros)
      setActivityData(defaultActivityData);

      // Use default empty completion data (all zeros)
      setCompletionData(defaultCompletionData);

      // Set statistics to zero for new mentors
      // These will be populated with real data when tests are created/completed
      setStatistics(prev => ({
        ...prev,
        activeTests: 0,
        completedTests: 0,
        avgScore: 0
      }));
      
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      toast({
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : "Não foi possível carregar os dados do dashboard",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LeaderLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : statistics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-28 mt-1" /> : statistics.totalClients > 0 ? "Clientes ativos" : "Nenhum cliente ainda"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testes Ativos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : statistics.activeTests}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-28 mt-1" /> : statistics.activeTests > 0 ? "Testes em andamento" : "Nenhum teste ativo"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testes Concluídos</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : statistics.completedTests}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-28 mt-1" /> : statistics.completedTests > 0 ? "Testes finalizados" : "Nenhum teste concluído"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : `${statistics.avgScore}%`}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-28 mt-1" /> : statistics.avgScore > 0 ? "Pontuação média atual" : "Sem dados de pontuação"}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Atividade Semanal</CardTitle>
            <CardDescription>
              Testes concluídos por dia na última semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tests" stroke="#8884d8" activeDot={{ r: 8 }} name="Testes" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Conclusão por Tipo</CardTitle>
            <CardDescription>
              Status dos testes por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#8884d8" name="Concluídos" />
                  <Bar dataKey="incomplete" stackId="a" fill="#82ca9d" name="Pendentes" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Clientes Recentes</CardTitle>
            <CardDescription>Últimos clientes adicionados à plataforma</CardDescription>
          </div>
          <Link to="/leader/clients" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
            Ver todos <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
              <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Sem clientes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Você ainda não tem clientes registrados. Convide novos clientes para começar.
              </p>
              <div className="mt-6">
                <Link to="/leader/clients?tab=invite" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar cliente
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                    <p className="text-sm text-gray-500 truncate">{client.email || "Email não disponível"}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(client.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </LeaderLayout>
  );
};

export default LeaderDashboard;
