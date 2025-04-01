
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowUp, ArrowDown, Minus } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";

// Mock data for the rankings
const topPerformers = [
  { id: 1, name: "Ana Silva", position: "Gerente de RH", score: 98, change: "up" },
  { id: 2, name: "Carlos Mendes", position: "Analista de RH", score: 95, change: "up" },
  { id: 3, name: "Juliana Costa", position: "Recrutadora", score: 92, change: "down" },
  { id: 4, name: "Pedro Santos", position: "Coordenador", score: 89, change: "same" },
  { id: 5, name: "Mariana Lima", position: "Analista de Performance", score: 86, change: "up" },
];

const teamRankings = [
  { id: 1, team: "Recrutamento e Seleção", score: 94, members: 8, change: "up" },
  { id: 2, team: "Desenvolvimento Organizacional", score: 91, members: 6, change: "up" },
  { id: 3, team: "Treinamento", score: 87, members: 5, change: "down" },
  { id: 4, team: "Benefícios", score: 84, members: 4, change: "same" },
];

const LeaderRankings = () => {
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
                  Atualizado em 15/06/2024
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
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
                  Atualizado em 15/06/2024
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </LeaderLayout>
  );
};

export default LeaderRankings;
