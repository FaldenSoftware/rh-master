
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, Brain, TrendingUp, Award, Calendar, ChevronRight } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Dados para o gráfico de resultados
const resultData = [
  { month: "Jan", score: 65 },
  { month: "Fev", score: 68 },
  { month: "Mar", score: 72 },
  { month: "Abr", score: 70 },
  { month: "Mai", score: 76 },
  { month: "Jun", score: 82 },
];

const ClientDashboard = () => {
  return (
    <ClientLayout title="Dashboard">
      <div className="space-y-6">
        {/* Visão geral */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testes Realizados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                +2 no último mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testes Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Próximo vence em 3 dias
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfil Principal</CardTitle>
              <Brain className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Planejador</div>
              <p className="text-xs text-muted-foreground">
                Baseado em seus resultados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontuação Geral</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82/100</div>
              <p className="text-xs text-muted-foreground">
                +6 pontos em relação ao trimestre anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Próximos testes e progresso */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Próximos Testes</CardTitle>
              <CardDescription>
                Testes pendentes a serem realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex items-center">
                  <div className="mr-4 bg-purple-100 p-2 rounded-md">
                    <Brain className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h3 className="text-sm font-medium">Perfil Comportamental DISC</h3>
                      <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                        Pendente
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>20 minutos para completar</span>
                      <span>Vence em 15/06/2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 bg-purple-100 p-2 rounded-md">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h3 className="text-sm font-medium">Inteligência Emocional</h3>
                      <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                        Pendente
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>15 minutos para completar</span>
                      <span>Vence em 18/06/2023</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  <span>Ver todos os testes</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Evolução de Resultados</CardTitle>
              <CardDescription>
                Progressão de suas pontuações nos últimos meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={resultData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium">Tendência</p>
                  <p className="text-xs text-muted-foreground">Em crescimento constante</p>
                </div>
                <Badge className="bg-green-500">+17 pontos em 6 meses</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo de competências */}
        <Card>
          <CardHeader>
            <CardTitle>Competências Comportamentais</CardTitle>
            <CardDescription>
              Resumo de suas principais habilidades avaliadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Proatividade</span>
                  <span className="text-sm">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Trabalho em Equipe</span>
                  <span className="text-sm">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Inteligência Emocional</span>
                  <span className="text-sm">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Liderança</span>
                  <span className="text-sm">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Comunicação</span>
                  <span className="text-sm">80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas e recomendações */}
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-600">Recomendação Personalizada</AlertTitle>
              <AlertDescription>
                Com base em seu perfil comportamental, sugerimos o treinamento "Liderança Situacional" 
                para potencializar sua carreira.
                <Button variant="link" className="p-0 h-auto text-blue-600 ml-2">
                  Saiba mais
                </Button>
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Workshop de Inteligência Emocional</p>
                      <p className="text-sm text-muted-foreground">20/06/2023 - Online - 14:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Feedback trimestral</p>
                      <p className="text-sm text-muted-foreground">28/06/2023 - Sala de Reuniões - 10:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
