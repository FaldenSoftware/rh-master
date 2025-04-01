
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, Download, FileText } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

// Dados para os gráficos
const monthlyProgressData = [
  { month: "Jan", score: 65 },
  { month: "Fev", score: 68 },
  { month: "Mar", score: 72 },
  { month: "Abr", score: 70 },
  { month: "Mai", score: 76 },
  { month: "Jun", score: 82 },
];

const testResultsData = [
  { name: "Perfil DISC", date: "10/05/2023", score: 82 },
  { name: "Inteligência Emocional", date: "15/04/2023", score: 75 },
  { name: "Proatividade", date: "20/03/2023", score: 90 },
  { name: "Trabalho em Equipe", date: "01/02/2023", score: 78 },
];

const skillsData = [
  { skill: "Comunicação", value: 80 },
  { skill: "Proatividade", value: 90 },
  { skill: "Trabalho em Equipe", value: 75 },
  { skill: "Liderança", value: 65 },
  { skill: "Inteligência Emocional", value: 85 },
];

const profileData = [
  { name: "Analítico", value: 75 },
  { name: "Comunicador", value: 60 },
  { name: "Executor", value: 45 },
  { name: "Planejador", value: 80 },
];

const radarData = [
  { subject: "Comunicação", value: 80, fullMark: 100 },
  { subject: "Liderança", value: 65, fullMark: 100 },
  { subject: "Proatividade", value: 90, fullMark: 100 },
  { subject: "Trabalho em Equipe", value: 75, fullMark: 100 },
  { subject: "Resiliência", value: 70, fullMark: 100 },
  { subject: "Inteligência Emocional", value: 85, fullMark: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ClientResults = () => {
  return (
    <ClientLayout title="Resultados">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tests">Testes Realizados</TabsTrigger>
          <TabsTrigger value="profile">Perfil Comportamental</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        {/* Visão Geral */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChartIcon className="mr-2 h-5 w-5 text-blue-500" />
                  Progresso nos Últimos Meses
                </CardTitle>
                <CardDescription>
                  Evolução das suas pontuações ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Pontuação"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="mr-2 h-5 w-5 text-purple-500" />
                  Distribuição de Habilidades
                </CardTitle>
                <CardDescription>
                  Análise das suas competências comportamentais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="João Silva" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Testes Realizados */}
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Testes</CardTitle>
              <CardDescription>
                Resultados dos seus testes comportamentais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {testResultsData.map((test, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-md">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{test.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>Realizado em {test.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0 flex items-center gap-3">
                        <Badge className={`${test.score >= 80 ? 'bg-green-500' : test.score >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`}>
                          {test.score}/100
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Pontuação Global</span>
                            <span className="text-sm">{test.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${test.score >= 80 ? 'bg-green-500' : test.score >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`}
                              style={{ width: `${test.score}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-gray-50">Perfil Comportamental</Badge>
                          <Badge variant="outline" className="bg-gray-50">Auto-Avaliação</Badge>
                          <Badge variant="outline" className="bg-gray-50">Concluído</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Perfil Comportamental */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="mr-2 h-5 w-5 text-purple-500" />
                  Distribuição de Perfil
                </CardTitle>
                <CardDescription>
                  Análise da sua composição comportamental
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={profileData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {profileData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Análise de Perfil</h3>
                  <p className="text-sm text-gray-700">
                    Seu perfil indica uma forte tendência para comportamentos planejadores e analíticos, 
                    o que demonstra boa capacidade de organização e atenção aos detalhes. Você possui 
                    uma abordagem metódica para resolver problemas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChartIcon className="mr-2 h-5 w-5 text-blue-500" />
                  Competências Principais
                </CardTitle>
                <CardDescription>
                  Suas habilidades comportamentais mais desenvolvidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart
                    data={skillsData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="skill" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Pontuação" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
                
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-800 mb-2">Destaques</h3>
                  <p className="text-sm text-gray-700">
                    Sua maior pontuação é em Proatividade (90/100), demonstrando uma excelente 
                    capacidade de iniciativa e antecipação. Você também tem bom desempenho em 
                    Inteligência Emocional (85/100).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Relatórios */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
              <CardDescription>
                Relatórios completos e detalhados dos seus resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-md">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Relatório Completo de Perfil Comportamental</h3>
                      <p className="text-sm text-muted-foreground">Análise detalhada do seu perfil DISC e recomendações</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Gerado em 15/05/2023
                      </div>
                    </div>
                  </div>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-md">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Análise de Inteligência Emocional</h3>
                      <p className="text-sm text-muted-foreground">Avaliação das competências em IE e sugestões de desenvolvimento</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Gerado em 20/04/2023
                      </div>
                    </div>
                  </div>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-md">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Plano de Desenvolvimento Individual</h3>
                      <p className="text-sm text-muted-foreground">Recomendações personalizadas para evolução profissional</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Gerado em 01/06/2023
                      </div>
                    </div>
                  </div>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-md">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Histórico de Evolução Semestral</h3>
                      <p className="text-sm text-muted-foreground">Comparativo dos resultados dos últimos 6 meses</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Gerado em 10/06/2023
                      </div>
                    </div>
                  </div>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ClientLayout>
  );
};

export default ClientResults;
