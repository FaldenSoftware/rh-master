
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, Clock, CheckCircle, AlertCircle, Brain, Heart, Users } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";

// Dados simulados dos testes
const testData = [
  {
    id: "T-1001",
    title: "Perfil Comportamental DISC",
    description: "Avaliação dos traços de comportamento: Dominância, Influência, Estabilidade e Conformidade",
    status: "pendente",
    timeEstimate: "20 minutos",
    icon: Brain,
    dueDate: "15/06/2023",
    category: "comportamental"
  },
  {
    id: "T-1002",
    title: "Inteligência Emocional",
    description: "Análise das habilidades de reconhecer e gerenciar emoções próprias e de outros",
    status: "pendente",
    timeEstimate: "15 minutos",
    icon: Heart,
    dueDate: "18/06/2023",
    category: "comportamental"
  },
  {
    id: "T-1003",
    title: "Trabalho em Equipe",
    description: "Avaliação de comportamentos e aptidões para colaboração em grupo",
    status: "concluído",
    timeEstimate: "25 minutos",
    icon: Users,
    completedDate: "10/05/2023",
    category: "comportamental"
  },
  {
    id: "T-1004",
    title: "Proatividade",
    description: "Análise da capacidade de antecipar problemas e buscar soluções de forma autônoma",
    status: "concluído",
    timeEstimate: "15 minutos",
    icon: ClipboardCheck,
    completedDate: "05/05/2023",
    category: "comportamental"
  }
];

const ClientTests = () => {
  return (
    <ClientLayout title="Meus Testes">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="grid gap-6 md:grid-cols-2">
            {testData.filter(test => test.status === "pendente").map((test) => (
              <Card key={test.id} className="overflow-hidden">
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
                        <span className="font-medium">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
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
                  <Button className="w-full">Iniciar Teste</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="grid gap-6 md:grid-cols-2">
            {testData.filter(test => test.status === "concluído").map((test) => (
              <Card key={test.id} className="overflow-hidden">
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
                  <Button variant="outline" className="w-full">Ver Resultados</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </ClientLayout>
  );
};

export default ClientTests;
