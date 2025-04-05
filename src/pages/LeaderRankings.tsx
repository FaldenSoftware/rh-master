import React, { useState, useEffect } from "react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getMentorClients } from "@/lib/batchQueries";

interface RankingClient {
  id: string;
  name: string;
  company?: string;
  score: number;
  testsCompleted: number;
  lastActivity: string;
}

const LeaderRankings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clients, setClients] = useState<RankingClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetchRankingData();
    }
  }, [user]);

  const fetchRankingData = async () => {
    try {
      setIsLoading(true);
      
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }

      // Fetch clients
      const clientsData = await getMentorClients(user.id);
      
      if (!clientsData || clientsData.length === 0) {
        setClients([]);
        return;
      }

      // Process clients data to add ranking metrics
      // In a real app, you would fetch actual test results and calculate real scores
      const rankingClients: RankingClient[] = clientsData.map(client => {
        // Generate random scores and activity for demo purposes
        const randomScore = Math.floor(Math.random() * 100);
        const testsCompleted = Math.floor(Math.random() * 10);
        
        // Generate a random date from the last 30 days
        const today = new Date();
        const lastActivityDate = new Date(today.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
        
        return {
          id: client.id,
          name: client.name,
          company: client.company,
          score: randomScore,
          testsCompleted: testsCompleted,
          lastActivity: lastActivityDate.toLocaleDateString('pt-BR')
        };
      });
      
      // Sort by score in descending order
      const sortedClients = rankingClients.sort((a, b) => b.score - a.score);
      setClients(sortedClients);
      
    } catch (error) {
      console.error("Erro ao carregar dados de ranking:", error);
      toast({
        title: "Erro ao carregar ranking",
        description: error instanceof Error ? error.message : "Não foi possível carregar os dados de ranking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadRanking = () => {
    // In a real implementation, this would generate a CSV or PDF with the ranking data
    toast({
      title: "Download iniciado",
      description: "O arquivo de ranking será baixado em breve.",
    });
  };

  const getRankBadgeColor = (index: number) => {
    if (index === 0) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (index === 1) return "bg-gray-100 text-gray-800 border-gray-300";
    if (index === 2) return "bg-amber-100 text-amber-800 border-amber-300";
    return "bg-blue-100 text-blue-800 border-blue-300";
  };

  return (
    <LeaderLayout title="Rankings">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ranking de Clientes</h1>
          <Button variant="outline" onClick={handleDownloadRanking}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Ranking
          </Button>
        </div>

        <Tabs defaultValue="score" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="score">Por Pontuação</TabsTrigger>
            <TabsTrigger value="activity">Por Atividade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="score">
            <Card>
              <CardHeader>
                <CardTitle>Ranking por Pontuação</CardTitle>
                <CardDescription>
                  Clientes ordenados por maior pontuação média nos testes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
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
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Sem dados de ranking</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Ainda não há clientes ou testes suficientes para gerar um ranking.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Posição</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead className="text-right">Pontuação</TableHead>
                          <TableHead className="text-right">Testes Concluídos</TableHead>
                          <TableHead className="text-right">Última Atividade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.map((client, index) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <Badge className={`font-bold ${getRankBadgeColor(index)}`}>
                                {index + 1}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={`https://avatar.vercel.sh/${client.name}.png`} />
                                  <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{client.name}</div>
                                  <div className="text-sm text-muted-foreground">{client.company || "Sem empresa"}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">{client.score}/100</TableCell>
                            <TableCell className="text-right">{client.testsCompleted}</TableCell>
                            <TableCell className="text-right">{client.lastActivity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Ranking por Atividade</CardTitle>
                <CardDescription>
                  Clientes ordenados por maior número de testes concluídos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
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
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Sem dados de ranking</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Ainda não há clientes ou testes suficientes para gerar um ranking.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Posição</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead className="text-right">Testes Concluídos</TableHead>
                          <TableHead className="text-right">Pontuação</TableHead>
                          <TableHead className="text-right">Última Atividade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...clients]
                          .sort((a, b) => b.testsCompleted - a.testsCompleted)
                          .map((client, index) => (
                            <TableRow key={client.id}>
                              <TableCell>
                                <Badge className={`font-bold ${getRankBadgeColor(index)}`}>
                                  {index + 1}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage src={`https://avatar.vercel.sh/${client.name}.png`} />
                                    <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{client.name}</div>
                                    <div className="text-sm text-muted-foreground">{client.company || "Sem empresa"}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">{client.testsCompleted}</TableCell>
                              <TableCell className="text-right">{client.score}/100</TableCell>
                              <TableCell className="text-right">{client.lastActivity}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LeaderLayout>
  );
};

export default LeaderRankings;
