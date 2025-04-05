
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowUp, ArrowDown, Minus } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Performer {
  id: string;
  name: string;
  position: string;
  score: number;
  change: "up" | "down" | "same";
}

interface TeamRanking {
  id: number;
  team: string;
  score: number;
  members: number;
  change: "up" | "down" | "same";
}

const LeaderRankings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [topPerformers, setTopPerformers] = useState<Performer[]>([]);
  const [teamRankings, setTeamRankings] = useState<TeamRanking[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchRankingData();
    }
  }, [user]);

  const fetchRankingData = async () => {
    setIsLoading(true);
    try {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar clientes do mentor para criar rankings
      const { data: clientsData, error: clientsError } = await supabase
        .rpc('get_mentor_clients', { mentor_id: user.id });

      if (clientsError) {
        console.error("Erro ao buscar clientes:", clientsError);
        throw clientsError;
      }

      if (!clientsData || clientsData.length === 0) {
        // Se não há clientes, use dados de exemplo
        setDefaultRankingData();
        return;
      }

      // Criar performers com base nos clientes reais
      const performers: Performer[] = clientsData.map((client: any, index: number) => {
        // Gerar pontuação aleatória para demonstração
        const score = Math.floor(Math.random() * 30) + 70;
        const changes = ["up", "down", "same"] as const;
        const randomChange = changes[Math.floor(Math.random() * changes.length)];
        
        return {
          id: client.id,
          name: client.name,
          position: client.company || "Colaborador",
          score,
          change: randomChange
        };
      });

      // Ordenar por pontuação
      performers.sort((a, b) => b.score - a.score);
      
      // Pegar os 5 primeiros
      const topFive = performers.slice(0, 5);
      setTopPerformers(topFive);

      // Criar dados de equipes com base em empresas
      const companies = new Map<string, { members: number, totalScore: number }>();
      
      clientsData.forEach((client: any) => {
        const company = client.company || "Sem empresa";
        if (!companies.has(company)) {
          companies.set(company, { members: 0, totalScore: 0 });
        }
        
        const companyData = companies.get(company)!;
        companyData.members += 1;
        companyData.totalScore += Math.floor(Math.random() * 30) + 70; // Score aleatório
      });

      const teams: TeamRanking[] = Array.from(companies.entries()).map(([company, data], index) => {
        const changes = ["up", "down", "same"] as const;
        const randomChange = changes[Math.floor(Math.random() * changes.length)];
        
        return {
          id: index + 1,
          team: company,
          score: Math.round(data.totalScore / data.members),
          members: data.members,
          change: randomChange
        };
      });

      // Ordenar por pontuação
      teams.sort((a, b) => b.score - a.score);
      setTeamRankings(teams);

    } catch (error) {
      console.error("Erro ao buscar dados de ranking:", error);
      toast({
        title: "Erro ao carregar rankings",
        description: "Não foi possível carregar os dados de ranking. Usando dados de exemplo.",
        variant: "destructive",
      });
      
      // Se houver erro, use dados de exemplo
      setDefaultRankingData();
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultRankingData = () => {
    // Dados de placeholder para quando não há clientes
    setTopPerformers([
      { id: "1", name: "Exemplo 1", position: "Gerente", score: 0, change: "same" },
      { id: "2", name: "Exemplo 2", position: "Analista", score: 0, change: "same" },
      { id: "3", name: "Exemplo 3", position: "Coordenador", score: 0, change: "same" }
    ]);
    
    setTeamRankings([
      { id: 1, team: "Equipe A", score: 0, members: 0, change: "same" },
      { id: 2, team: "Equipe B", score: 0, members: 0, change: "same" }
    ]);
  };

  // Helper function to render change indicator
  const renderChangeIndicator = (change: string) => {
    switch (change) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <LeaderLayout title="Rankings">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </LeaderLayout>
    );
  }

  return (
    <LeaderLayout title="Rankings">
      <Tabs defaultValue="individuals" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="individuals">Individuais</TabsTrigger>
          <TabsTrigger value="teams">Equipes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="individuals">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-yellow-500" />
                    Top Performers
                  </CardTitle>
                  <CardDescription>
                    Colaboradores com melhor desempenho nos testes
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Atualizado em {new Date().toLocaleDateString('pt-BR')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {topPerformers.length > 0 ? (
                <div className="space-y-6">
                  {topPerformers.map((performer, index) => (
                    <div key={performer.id} className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${performer.id}`} alt={performer.name} />
                        <AvatarFallback>{performer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{performer.name}</div>
                        <div className="text-sm text-muted-foreground">{performer.position}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-lg">{performer.score}</div>
                        {renderChangeIndicator(performer.change)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-lg font-medium">Nenhum dado disponível</p>
                  <p className="text-sm max-w-md mx-auto mt-1">
                    Os rankings serão exibidos quando houver dados de desempenho disponíveis.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-blue-500" />
                    Performance de Equipes
                  </CardTitle>
                  <CardDescription>
                    Ranking de desempenho por equipes
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Atualizado em {new Date().toLocaleDateString('pt-BR')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {teamRankings.length > 0 ? (
                <div className="space-y-6">
                  {teamRankings.map((team, index) => (
                    <div key={team.id} className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{team.team}</div>
                        <div className="text-sm text-muted-foreground">{team.members} membros</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-lg">{team.score}</div>
                        {renderChangeIndicator(team.change)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-lg font-medium">Nenhum dado disponível</p>
                  <p className="text-sm max-w-md mx-auto mt-1">
                    Os rankings de equipes serão exibidos quando houver dados disponíveis.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </LeaderLayout>
  );
};

export default LeaderRankings;
