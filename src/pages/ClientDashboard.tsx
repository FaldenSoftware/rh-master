import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, Brain, TrendingUp, Award, Calendar, ChevronRight, Loader2, FileText } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useTestResults } from "@/hooks/useTestResults";

const ClientDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  // Buscar dados de testes do usuário
  const fetchUserDashboardData = async () => {
    if (!userId) return null;

    try {
      // Buscar testes do cliente
      const { data: clientTests, error: testsError } = await supabase
        .from('client_tests')
        .select('*')
        .eq('client_id', userId);

      if (testsError) {
        throw new Error(`Erro ao buscar testes: ${testsError.message}`);
      }

      // Buscar informações dos testes
      const testIds = clientTests?.map(test => test.test_id) || [];
      const { data: testsInfo, error: testsInfoError } = await supabase
        .from('tests')
        .select('*')
        .in('id', testIds);
      
      if (testsInfoError) {
        console.error("Erro ao buscar informações dos testes:", testsInfoError);
      }

      // Criar mapeamento de testes
      const testsMap = new Map();
      if (testsInfo) {
        testsInfo.forEach(test => {
          testsMap.set(test.id, test);
        });
      }

      // Enriquecer os dados de client_tests com as informações dos testes
      const enrichedClientTests = clientTests?.map(test => ({
        ...test,
        testInfo: testsMap.get(test.test_id) || { title: "Teste", description: "Sem descrição" }
      })) || [];

      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
        // Não lançamos erro aqui para não impedir o carregamento do resto dos dados
      }

      // Processar os dados para o formato necessário para o dashboard
      const completedTests = enrichedClientTests?.filter(test => test.is_completed) || [];
      const pendingTests = enrichedClientTests?.filter(test => !test.is_completed) || [];

      return {
        pendingTests,
        completedTests,
        profile: profileData || null,
        totalTests: enrichedClientTests?.length || 0
      };
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  };

  // Usar React Query para gerenciar o estado da busca
  const { 
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError
  } = useQuery({
    queryKey: ['dashboardData', userId],
    queryFn: fetchUserDashboardData,
    enabled: !!userId
  });

  // Buscar resultados de testes para gráficos
  const { 
    data: testResults = [],
    isLoading: isResultsLoading
  } = useTestResults(userId || undefined);

  // Gerar dados para o gráfico de resultados
  const generateResultData = () => {
    if (testResults.length === 0) {
      // Dados de exemplo se não houver testes concluídos
      const lastSixMonths = [];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() - i);
        
        // Nomes dos meses em português
        const monthName = month.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        
        lastSixMonths.push({
          month: capitalizedMonth,
          score: 65 + Math.floor(Math.random() * 3) * 5 + i * 3 // Valor base + variação aleatória + progressão
        });
      }
      
      return lastSixMonths;
    } else {
      // Ordenar resultados por data
      const sortedResults = [...testResults].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Pegar até os últimos 6 resultados
      const recentResults = sortedResults.slice(-6);
      
      // Formatar para o gráfico
      return recentResults.map(result => ({
        month: new Date(result.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        score: result.score
      }));
    }
  };

  const resultData = generateResultData();

  // Função para navegar para a página de testes
  const handleViewAllTests = () => {
    navigate('/client/tests');
  };

  // Se estiver carregando, mostre um indicador de loading
  if (isDashboardLoading || isResultsLoading) {
    return (
      <ClientLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-muted-foreground">Carregando seu dashboard...</p>
        </div>
      </ClientLayout>
    );
  }

  // Se ocorreu um erro, mostre uma mensagem de erro
  if (isDashboardError) {
    return (
      <ClientLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Erro ao carregar dashboard</h3>
          <p className="text-muted-foreground max-w-md">
            Ocorreu um erro ao tentar carregar seus dados. Por favor, tente novamente mais tarde.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </ClientLayout>
    );
  }

  // Determinar perfil predominante baseado nos resultados ou usar valor padrão
  const dominantProfile = testResults.length > 0 && testResults[0].profileScores 
    ? testResults[0].profileScores.sort((a, b) => b.value - a.value)[0].name 
    : "Planejador";

  // Calcular pontuação geral média ou usar valor padrão
  const averageScore = testResults.length > 0 
    ? Math.round(testResults.reduce((sum, test) => sum + test.score, 0) / testResults.length) 
    : 82;

  // Obter habilidades em ordem decrescente de pontuação
  const topSkills = testResults.length > 0 && testResults[0].skillScores
    ? [...testResults[0].skillScores].sort((a, b) => b.value - a.value)
    : [
        { skill: "Proatividade", value: 90 },
        { skill: "Inteligência Emocional", value: 85 },
        { skill: "Comunicação", value: 80 },
        { skill: "Trabalho em Equipe", value: 75 },
        { skill: "Liderança", value: 65 }
      ];

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
              <div className="text-2xl font-bold">{dashboardData?.completedTests.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.completedTests.length 
                  ? `Último concluído em ${new Date(dashboardData.completedTests[0].completed_at || '').toLocaleDateString('pt-BR')}` 
                  : "Nenhum teste concluído"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testes Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.pendingTests.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.pendingTests.length > 0 
                  ? "Clique em 'Ver todos os testes' para iniciá-los" 
                  : "Nenhum teste pendente"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfil Principal</CardTitle>
              <Brain className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dominantProfile}</div>
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
              <div className="text-2xl font-bold">{averageScore}/100</div>
              <p className="text-xs text-muted-foreground">
                {testResults.length > 0 
                  ? "Média de todos os testes concluídos" 
                  : "Complete testes para obter sua pontuação"}
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
              {dashboardData?.pendingTests.length ? (
                <div className="space-y-5">
                  {dashboardData.pendingTests.slice(0, 2).map((test) => (
                    <div key={test.id} className="flex items-center">
                      <div className="mr-4 bg-purple-100 p-2 rounded-md">
                        <Brain className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h3 className="text-sm font-medium">{test.testInfo.title}</h3>
                          <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                            Pendente
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Aproximadamente 20 minutos para completar</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" size="sm" onClick={handleViewAllTests}>
                    <span>Ver todos os testes</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
                    <CheckCircle className="h-5 w-5 text-gray-500" />
                  </div>
                  <h3 className="text-sm font-medium mb-2">Nenhum teste pendente</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4">
                    Você não tem testes pendentes no momento.
                  </p>
                </div>
              )}
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
                  <p className="text-xs text-muted-foreground">
                    {testResults.length > 0 
                      ? "Baseada em seus testes concluídos" 
                      : "Complete testes para visualizar sua tendência"}
                  </p>
                </div>
                {testResults.length > 0 && (
                  <Badge className="bg-green-500">
                    {resultData.length > 1 
                      ? `${Math.round(resultData[resultData.length - 1].score - resultData[0].score)} pontos de evolução` 
                      : "Evolução disponível após mais testes"}
                  </Badge>
                )}
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
            {topSkills.length > 0 ? (
              <div className="space-y-4">
                {topSkills.map((skill) => (
                  <div key={skill.skill}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{skill.skill}</span>
                      <span className="text-sm">{skill.value}%</span>
                    </div>
                    <Progress value={skill.value} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Complete pelo menos um teste para visualizar suas competências comportamentais.
                </p>
              </div>
            )}
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
                {testResults.length > 0 
                  ? `Com base em seu perfil ${dominantProfile}, sugerimos o treinamento "Liderança Situacional" para potencializar sua carreira.`
                  : "Complete testes comportamentais para receber recomendações personalizadas para seu desenvolvimento."}
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
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')} - Online - 14:00
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Feedback trimestral</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')} - Sala de Reuniões - 10:00
                      </p>
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
