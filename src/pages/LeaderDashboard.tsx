
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { ArrowUp, ArrowDown, Users, FileText, Clock, BarChart as BarChartIcon, Activity, Award, Calendar, Percent, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { getMentorClients } from "@/lib/batchQueries";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Helper function to format percentage change with proper sign
const formatPercentChange = (value: number) => {
  return `${value > 0 ? '+' : ''}${value}%`;
};

// Helper function to get class based on trend direction
const getTrendClass = (value: number) => {
  return value >= 0 ? "text-green-600" : "text-red-600";
};

const LeaderDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Performance data
  const [performanceData, setPerformanceData] = useState([
    { month: 'Jan', value: 65 },
    { month: 'Fev', value: 68 },
    { month: 'Mar', value: 72 },
    { month: 'Abr', value: 75 },
    { month: 'Mai', value: 78 },
    { month: 'Jun', value: 82 }
  ]);
  
  const fetchRecentClients = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const clients = await getMentorClients(user.id);
      
      // Processar apenas se há clientes
      if (clients && clients.length > 0) {
        // Pegar os 3 mais recentes
        const recent = clients
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)
          .map(client => ({
            id: client.id,
            name: client.name,
            company: client.company || 'Empresa não especificada',
            date: new Date(client.created_at).toLocaleDateString('pt-BR')
          }));
          
        setRecentClients(recent);
      } else {
        // Se não há clientes, definir como array vazio
        setRecentClients([]);
      }
      
    } catch (err: any) {
      console.error("Erro ao carregar clientes recentes:", err);
      setError(err.message || "Erro ao carregar clientes recentes");
      toast({
        title: "Erro ao carregar dados",
        description: err.message || "Ocorreu um erro ao carregar os clientes recentes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRecentClients();
    // Simular carregamento de dados de desempenho (em uma implementação real, isso viria do backend)
    const generateRandomPerformanceData = () => {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      let baseValue = 60 + Math.floor(Math.random() * 20);
      
      return months.map(month => {
        baseValue = baseValue + Math.floor(Math.random() * 5) - 1;
        return {
          month: month,
          value: Math.min(100, Math.max(60, baseValue))
        };
      });
    };
    
    setPerformanceData(generateRandomPerformanceData());
  }, [user?.id]);
  
  // Dados de estatísticas
  const stats = [
    { 
      title: "Total de Clientes", 
      value: isLoading ? "-" : recentClients.length || 0, 
      change: "+12%", 
      trend: "up",
      icon: <Users className="h-5 w-5 text-blue-600" />
    },
    { 
      title: "Testes Realizados", 
      value: "23", 
      change: "+18%", 
      trend: "up",
      icon: <FileText className="h-5 w-5 text-purple-600" />
    },
    { 
      title: "Tempo Médio por Teste", 
      value: "18min", 
      change: "-5%", 
      trend: "down",
      icon: <Clock className="h-5 w-5 text-amber-600" />
    },
    { 
      title: "Score Médio", 
      value: "74/100", 
      change: "+3%", 
      trend: "up",
      icon: <BarChartIcon className="h-5 w-5 text-green-600" />
    }
  ];
  
  return (
    <LeaderLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <div className="bg-slate-100 p-2 rounded-full">
                    {stat.icon}
                  </div>
                  <div className={`flex items-center ${getTrendClass(stat.trend === 'up' ? 1 : -1)}`}>
                    {stat.trend === 'up' ? 
                      <ArrowUp className="h-4 w-4 mr-1" /> : 
                      <ArrowDown className="h-4 w-4 mr-1" />
                    }
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <h3 className="mt-3 font-semibold text-lg md:text-xl">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Performance Trends */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-500" />
                Tendências de Desempenho
              </CardTitle>
              <CardDescription>
                Progresso médio dos clientes nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] lg:h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[40, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      name="Performance"
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Clients */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-500" />
                Clientes Recentes
              </CardTitle>
              <CardDescription>
                Últimos clientes adicionados
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin h-6 w-6 border-2 border-purple-500 rounded-full border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <p className="text-red-500 mb-2">{error}</p>
                  <button 
                    onClick={fetchRecentClients}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : recentClients.length === 0 ? (
                <div className="text-center py-6 px-4">
                  <User className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">Nenhum cliente registrado ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentClients.map((client, index) => (
                    <div key={client.id || index} className="flex items-center p-3 border rounded-lg">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                        <p className="text-xs text-gray-500 truncate">{client.company}</p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {client.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Distribution by Profile */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Percent className="mr-2 h-5 w-5 text-amber-500" />
                Distribuição por Perfil
              </CardTitle>
              <CardDescription>
                Perfis comportamentais predominantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Analítico', value: 35 },
                        { name: 'Comunicador', value: 25 },
                        { name: 'Executor', value: 20 },
                        { name: 'Planejador', value: 20 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2, 3].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Skills Analysis */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Award className="mr-2 h-5 w-5 text-green-500" />
                Análise de Competências
              </CardTitle>
              <CardDescription>
                Nível médio de habilidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Comunicação', value: 75 },
                      { name: 'Liderança', value: 65 },
                      { name: 'Trabalho em Equipe', value: 78 },
                      { name: 'Proatividade', value: 72 },
                      { name: 'Resiliência', value: 68 }
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Pontuação" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Ongoing Tests */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Testes em Andamento
            </CardTitle>
            <CardDescription>
              Status atual dos testes dos clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  client: "Maria Silva",
                  test: "Perfil de Liderança",
                  progress: 75,
                  deadline: "12/04/2023"
                },
                {
                  client: "João Pereira",
                  test: "Avaliação de Competências",
                  progress: 30,
                  deadline: "15/04/2023"
                },
                {
                  client: "Ana Costa",
                  test: "Análise Comportamental",
                  progress: 90,
                  deadline: "10/04/2023"
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{item.client}</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Prazo: {item.deadline}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.test}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    <span className="text-xs font-medium">{item.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-gray-500">Atualizados em tempo real</p>
          </CardFooter>
        </Card>
      </div>
    </LeaderLayout>
  );
};

export default LeaderDashboard;
