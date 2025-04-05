
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Award, User, Users, BarChart2, ArrowUp, ArrowDown, Clock, X } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { getMentorClients } from "@/lib/batchQueries";

interface Client {
  id: string;
  name: string;
  company?: string;
  score: number;
  trend: "up" | "down" | "neutral";
  change: string;
  skills: { name: string; score: number }[];
}

const LeaderRankings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchClients();
    }
  }, [user?.id]);
  
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar clientes
      const data = await getMentorClients(user!.id);
      
      // Se não há clientes, definir como array vazio
      if (!data || data.length === 0) {
        setClients([]);
        return;
      }
      
      // Para cada cliente, vamos simular dados de scores
      // Em uma implementação real, estes dados viriam dos resultados de testes
      const clientsWithScores = data.map(client => {
        // Gerar score aleatório entre 60 e 95
        const score = Math.floor(Math.random() * 36) + 60;
        
        // Gerar tendência aleatória
        const trendOptions: ("up" | "down" | "neutral")[] = ["up", "down", "neutral"];
        const trend = trendOptions[Math.floor(Math.random() * 3)];
        
        // Gerar valor de mudança com base na tendência
        const changeValue = trend === "up" ? 
          Math.floor(Math.random() * 10) + 1 : 
          trend === "down" ? 
            -(Math.floor(Math.random() * 10) + 1) : 
            0;
            
        // Gerar habilidades com pontuações
        const skills = [
          { name: "Comunicação", score: Math.floor(Math.random() * 41) + 60 },
          { name: "Liderança", score: Math.floor(Math.random() * 41) + 60 },
          { name: "Trabalho em Equipe", score: Math.floor(Math.random() * 41) + 60 },
          { name: "Proatividade", score: Math.floor(Math.random() * 41) + 60 },
          { name: "Resiliência", score: Math.floor(Math.random() * 41) + 60 },
        ];
          
        return {
          id: client.id,
          name: client.name,
          company: client.company,
          score: score,
          trend: trend,
          change: `${changeValue > 0 ? '+' : ''}${changeValue}%`,
          skills: skills
        };
      });
      
      // Ordenar por score (do maior para o menor)
      const sortedClients = clientsWithScores.sort((a, b) => b.score - a.score);
      setClients(sortedClients);
      
    } catch (error: any) {
      console.error("Erro ao buscar clientes:", error);
      setError(error.message || "Ocorreu um erro ao buscar os dados dos clientes");
      toast({
        title: "Erro ao buscar dados",
        description: error.message || "Ocorreu um erro ao buscar os dados dos clientes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para calcular a cor baseada na pontuação
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  // Função para obter ícone baseado na tendência
  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    if (trend === "up") return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (trend === "down") return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };
  
  // Função para obter a classe CSS baseada na tendência
  const getTrendClass = (trend: "up" | "down" | "neutral") => {
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-red-500";
    return "text-gray-400";
  };

  return (
    <LeaderLayout title="Rankings">
      <Tabs defaultValue="individual" className="w-full">
        <TabsList>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="company">Por Empresa</TabsTrigger>
        </TabsList>
        
        {/* Individual Rankings */}
        <TabsContent value="individual">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Top Performers */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-amber-500" />
                  Top Performers
                </CardTitle>
                <CardDescription>
                  Ranking de clientes por pontuação geral
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center py-6">
                    <X className="h-8 w-8 text-red-500 mb-2" />
                    <p className="text-center text-red-500 mb-2">{error}</p>
                    <button 
                      onClick={fetchClients}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Tentar novamente
                    </button>
                  </div>
                ) : clients.length === 0 ? (
                  <div className="flex flex-col items-center py-12">
                    <Users className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-center text-gray-500">Nenhum cliente cadastrado</p>
                    <p className="text-center text-gray-400 text-sm mt-1">
                      Adicione clientes para visualizar o ranking
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clients.slice(0, 5).map((client, index) => (
                      <div key={client.id} className="flex items-center p-4 border rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-semibold mr-4">
                          {index + 1}
                        </div>
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{client.name}</h4>
                          <p className="text-sm text-gray-500">{client.company || "Empresa não especificada"}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className={getScoreColor(client.score)}>
                            {client.score}/100
                          </Badge>
                          <div className={`flex items-center mt-1 text-xs ${getTrendClass(client.trend)}`}>
                            {getTrendIcon(client.trend)}
                            <span className="ml-1">{client.change}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {clients.length > 5 && (
                      <p className="text-center text-sm text-gray-500 pt-2">
                        Mostrando 5 de {clients.length} clientes
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-blue-500" />
                  Top Habilidades
                </CardTitle>
                <CardDescription>
                  Média de pontuação por habilidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                  </div>
                ) : error || clients.length === 0 ? (
                  <div className="flex flex-col items-center py-12">
                    <BarChart2 className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-center text-gray-500">Dados não disponíveis</p>
                    <p className="text-center text-gray-400 text-sm mt-1">
                      {error || "Adicione clientes para visualizar estatísticas"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Calculate average score for each skill across all clients */}
                    {(() => {
                      const skillMap = new Map<string, number[]>();
                      
                      clients.forEach(client => {
                        client.skills.forEach(skill => {
                          if (!skillMap.has(skill.name)) {
                            skillMap.set(skill.name, []);
                          }
                          skillMap.get(skill.name)?.push(skill.score);
                        });
                      });
                      
                      const averageSkills = Array.from(skillMap.entries()).map(([name, scores]) => {
                        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                        return { name, score: Math.round(average) };
                      }).sort((a, b) => b.score - a.score);
                      
                      return averageSkills.map(skill => (
                        <div key={skill.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-600">{skill.score}/100</span>
                          </div>
                          <Progress value={skill.score} className="h-2" />
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Performance Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-purple-500" />
                Comparativo de Desempenho
              </CardTitle>
              <CardDescription>
                Visualização das pontuações gerais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : error || clients.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <BarChart2 className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-center text-gray-500">Dados não disponíveis</p>
                  <p className="text-center text-gray-400 text-sm mt-1">
                    {error || "Adicione clientes para visualizar estatísticas"}
                  </p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={clients.map(client => ({
                        name: client.name.length > 15 ? 
                          `${client.name.substring(0, 12)}...` : 
                          client.name,
                        score: client.score
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        tick={{fontSize: 12}}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#8884d8" name="Pontuação" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Skills Ranking */}
        <TabsContent value="skills">
          {/* Em uma implementação real, aqui seria adicionado o conteúdo da aba de Habilidades */}
          <Card>
            <CardHeader>
              <CardTitle>Ranking por Habilidades</CardTitle>
              <CardDescription>
                Estatísticas detalhadas por cada habilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-8">
                <BarChart2 className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-center text-gray-500">Em desenvolvimento</p>
                <p className="text-center text-gray-400 text-sm mt-1">
                  Esta funcionalidade estará disponível em breve
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Company Ranking */}
        <TabsContent value="company">
          {/* Em uma implementação real, aqui seria adicionado o conteúdo da aba de Empresas */}
          <Card>
            <CardHeader>
              <CardTitle>Ranking por Empresa</CardTitle>
              <CardDescription>
                Comparativo de desempenho entre empresas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-8">
                <Users className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-center text-gray-500">Em desenvolvimento</p>
                <p className="text-center text-gray-400 text-sm mt-1">
                  Esta funcionalidade estará disponível em breve
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </LeaderLayout>
  );
};

export default LeaderRankings;
