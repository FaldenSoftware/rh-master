import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, Download, FileText, Loader2 } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useTestResults } from "@/hooks/useTestResults";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ClientResults = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const { data: testResults = [], isLoading, isError } = useTestResults(userId || undefined);
  
  const generateMonthlyProgressData = () => {
    if (testResults.length >= 2) {
      const sortedResults = [...testResults].sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });
      
      return sortedResults.map(result => ({
        month: new Date(result.date.split('/').reverse().join('-'))
          .toLocaleDateString('pt-BR', { month: 'short' })
          .replace('.', '')
          .charAt(0).toUpperCase() + 
          new Date(result.date.split('/').reverse().join('-'))
          .toLocaleDateString('pt-BR', { month: 'short' })
          .replace('.', '')
          .slice(1),
        score: result.score
      }));
    } else {
      const lastSixMonths = [];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() - i);
        
        const monthName = month.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        
        const score = i === 0 && testResults.length > 0 
          ? testResults[0].score 
          : 65 + Math.floor(Math.random() * 3) * 5 + i * 3;
        
        lastSixMonths.push({
          month: capitalizedMonth,
          score: score
        });
      }
      
      return lastSixMonths;
    }
  };
  
  const monthlyProgressData = generateMonthlyProgressData();

  if (isLoading) {
    return (
      <ClientLayout title="Resultados">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-muted-foreground">Carregando seus resultados...</p>
        </div>
      </ClientLayout>
    );
  }

  if (isError) {
    return (
      <ClientLayout title="Resultados">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Erro ao carregar resultados</h3>
          <p className="text-muted-foreground max-w-md">
            Ocorreu um erro ao tentar carregar seus resultados. Por favor, tente novamente mais tarde.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Resultados">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tests">Testes Realizados</TabsTrigger>
          <TabsTrigger value="profile">Perfil Comportamental</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
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
                {monthlyProgressData.length > 0 ? (
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
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-muted-foreground">
                      Não há dados suficientes para exibir o gráfico de progresso.
                    </p>
                  </div>
                )}
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
                {testResults.length > 0 && testResults[0].radarData ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={testResults[0].radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Perfil" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip formatter={(value) => `${Number(value).toFixed(0)}/100`} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-muted-foreground">
                      Complete pelo menos um teste para visualizar seu perfil de habilidades.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Testes</CardTitle>
              <CardDescription>
                Resultados dos seus testes comportamentais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 ? (
                <div className="space-y-6">
                  {testResults.map((test) => (
                    <div key={test.id} className="border rounded-lg overflow-hidden">
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
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nenhum teste concluído</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Você ainda não concluiu nenhum teste. Complete seus testes pendentes para visualizar os resultados aqui.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
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
                {testResults.length > 0 && testResults[0].profileScores ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={testResults[0].profileScores}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {testResults[0].profileScores.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value).toFixed(0)}%`} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-muted-foreground">
                      Complete pelo menos um teste para visualizar seu perfil comportamental.
                    </p>
                  </div>
                )}
                
                {testResults.length > 0 ? (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Análise de Perfil</h3>
                    <p className="text-sm text-gray-700">
                      Seu perfil indica uma forte tendência para comportamentos planejadores e analíticos, 
                      o que demonstra boa capacidade de organização e atenção aos detalhes. Você possui 
                      uma abordagem metódica para resolver problemas.
                    </p>
                  </div>
                ) : null}
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
                {testResults.length > 0 && testResults[0].skillScores ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart
                      data={testResults[0].skillScores}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="skill" />
                      <Tooltip formatter={(value) => `${Number(value).toFixed(0)}/100`} />
                      <Legend />
                      <Bar dataKey="value" name="Pontuação" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-muted-foreground">
                      Complete pelo menos um teste para visualizar suas competências principais.
                    </p>
                  </div>
                )}
                
                {testResults.length > 0 && testResults[0].skillScores ? (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-lg font-medium text-purple-800 mb-2">Destaques</h3>
                    <p className="text-sm text-gray-700">
                      {testResults[0].skillScores.length > 0 ? (
                        <>
                          Sua maior pontuação é em {testResults[0].skillScores.sort((a, b) => b.value - a.value)[0].skill} 
                          ({testResults[0].skillScores.sort((a, b) => b.value - a.value)[0].value}/100), 
                          demonstrando uma excelente capacidade nesta área.
                        </>
                      ) : (
                        "Complete mais testes para obter uma análise detalhada de suas competências."
                      )}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
              <CardDescription>
                Relatórios completos e detalhados dos seus resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 ? (
                <div className="space-y-4">
                  {testResults.map((test) => (
                    <div key={test.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-md">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{test.name}</h3>
                          <p className="text-sm text-muted-foreground">Análise detalhada e recomendações</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Gerado em {test.date}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nenhum relatório disponível</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Complete seus testes para ter acesso aos relatórios detalhados com análises e recomendações personalizadas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ClientLayout>
  );
};

export default ClientResults;
