
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClientLayout from "@/components/client/ClientLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";
import { useTestResults } from "@/hooks/useTestResults";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ClientProfile = () => {
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
  
  const latestTest = testResults.length > 0 ? testResults[0] : null;
  const hasTestData = !!latestTest;
  
  if (isLoading) {
    return (
      <ClientLayout title="Perfil Comportamental">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-muted-foreground">Carregando seu perfil...</p>
        </div>
      </ClientLayout>
    );
  }

  if (isError) {
    return (
      <ClientLayout title="Perfil Comportamental">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Erro ao carregar perfil</h3>
          <p className="text-muted-foreground max-w-md">
            Ocorreu um erro ao tentar carregar seu perfil. Por favor, tente novamente mais tarde.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </ClientLayout>
    );
  }

  if (!hasTestData) {
    return (
      <ClientLayout title="Perfil Comportamental">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <FileText className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Perfil não disponível</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Complete pelo menos um teste comportamental para visualizar seu perfil detalhado.
          </p>
          <Button className="mt-6" onClick={() => window.location.href = "/client/tests"}>
            Realizar testes
          </Button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Perfil Comportamental">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seu Perfil Dominante</CardTitle>
            <CardDescription>
              Baseado nos testes comportamentais realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {latestTest?.profileScores && latestTest.profileScores.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={latestTest.profileScores}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {latestTest.profileScores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toFixed(0)}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Complete um teste para visualizar seu perfil completo</p>
                </div>
              )}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                Perfil Predominante: {latestTest?.profileScores && latestTest.profileScores.length > 0 
                  ? latestTest.profileScores.sort((a, b) => b.value - a.value)[0].name 
                  : "Não determinado"}
              </h3>
              <p className="text-sm text-gray-700">
                {latestTest?.profileScores && latestTest.profileScores.length > 0 ? 
                  (() => {
                    const dominantProfile = latestTest.profileScores.sort((a, b) => b.value - a.value)[0].name;
                    switch (dominantProfile) {
                      case "Planejador":
                        return "Pessoas com perfil planejador são organizadas, metódicas e priorizam estrutura e processos. Possuem excelente capacidade analítica e atenção aos detalhes.";
                      case "Analítico":
                        return "Pessoas com perfil analítico são atentas aos detalhes, precisas e metódicas. Valorizam dados e fatos para tomar decisões e resolver problemas de forma lógica.";
                      case "Comunicador":
                        return "Pessoas com perfil comunicador são expressivas, entusiasmadas e sociáveis. Gostam de interagir com os outros e têm grande capacidade de influência e persuasão.";
                      case "Executor":
                        return "Pessoas com perfil executor são orientadas a resultados, decididas e práticas. Preferem agir rapidamente e são eficientes na implementação de tarefas.";
                      default:
                        return "Complete mais testes para obter uma análise detalhada do seu perfil comportamental predominante.";
                    }
                  })()
                  : "Complete pelo menos um teste comportamental para visualizar seu perfil predominante."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Características Comportamentais</CardTitle>
            <CardDescription>
              Análise detalhada de suas competências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {latestTest?.radarData && latestTest.radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={latestTest.radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Competências" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip formatter={(value) => `${Number(value).toFixed(0)}/100`} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Complete um teste para visualizar suas competências</p>
                </div>
              )}
            </div>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">
                Destaque: {latestTest?.radarData && latestTest.radarData.length > 0 
                  ? latestTest.radarData.sort((a, b) => b.value - a.value)[0].subject 
                  : "Não determinado"}
              </h3>
              <p className="text-sm text-gray-700">
                {latestTest?.radarData && latestTest.radarData.length > 0 ? (
                  `Você demonstra alta capacidade em ${latestTest.radarData.sort((a, b) => b.value - a.value)[0].subject}, 
                  característica muito valorizada em ambientes profissionais dinâmicos.`
                ) : (
                  "Complete um teste comportamental para visualizar suas características em destaque."
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recomendações de Desenvolvimento</CardTitle>
            <CardDescription>
              Baseadas no seu perfil comportamental atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  {latestTest.profileScores && latestTest.profileScores.length > 0 
                    ? `Equilíbrio entre ${latestTest.profileScores.sort((a, b) => b.value - a.value)[0].name} e Complementos`
                    : "Desenvolvimento Equilibrado"}
                </h3>
                <p className="text-sm text-gray-700">
                  {latestTest.profileScores && latestTest.profileScores.length > 0 && 
                   latestTest.profileScores.sort((a, b) => b.value - a.value)[0].name === "Planejador" ? (
                    "Seu perfil planejador é um grande diferencial, mas pode se beneficiar desenvolvendo mais características executoras para implementar suas ideias com maior rapidez."
                  ) : latestTest.profileScores && latestTest.profileScores.length > 0 && 
                     latestTest.profileScores.sort((a, b) => b.value - a.value)[0].name === "Analítico" ? (
                    "Seu perfil analítico é muito valioso, mas considere desenvolver mais suas habilidades comunicativas para expressar suas análises de forma mais impactante."
                  ) : latestTest.profileScores && latestTest.profileScores.length > 0 && 
                     latestTest.profileScores.sort((a, b) => b.value - a.value)[0].name === "Comunicador" ? (
                    "Sua habilidade de comunicação é excelente, porém pode se beneficiar do desenvolvimento de disciplina analítica para dar mais profundidade às suas interações."
                  ) : latestTest.profileScores && latestTest.profileScores.length > 0 && 
                     latestTest.profileScores.sort((a, b) => b.value - a.value)[0].name === "Executor" ? (
                    "Seu perfil executor é muito eficiente, mas considere desenvolver mais paciência para planejamento estratégico antes de iniciar a implementação."
                  ) : (
                    "Busque desenvolver um conjunto equilibrado de habilidades comportamentais que complementem seu perfil natural."
                  )}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  {latestTest.radarData && latestTest.radarData.length > 0 
                    ? `Desenvolvimento em ${latestTest.radarData.sort((a, b) => a.value - b.value)[0].subject}`
                    : "Áreas de Desenvolvimento"}
                </h3>
                <p className="text-sm text-gray-700">
                  {latestTest.radarData && latestTest.radarData.length > 0 ? (
                    `Sugerimos foco no desenvolvimento de ${latestTest.radarData.sort((a, b) => a.value - b.value)[0].subject}, 
                    que apresentou menor pontuação em seu perfil, para complementar suas fortes capacidades 
                    em ${latestTest.radarData.sort((a, b) => b.value - a.value)[0].subject}.`
                  ) : (
                    "Recomendamos identificar e desenvolver áreas específicas que podem complementar suas qualidades naturais para um perfil profissional mais completo."
                  )}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Cursos Recomendados</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {latestTest.radarData && latestTest.radarData.length > 0 && 
                   latestTest.radarData.sort((a, b) => a.value - b.value)[0].subject === "Liderança" ? (
                    <>
                      <li>Liderança Situacional</li>
                      <li>Coaching para Gestores</li>
                      <li>Desenvolvimento de Equipes de Alto Desempenho</li>
                    </>
                  ) : latestTest.radarData && latestTest.radarData.length > 0 && 
                     latestTest.radarData.sort((a, b) => a.value - b.value)[0].subject === "Comunicação" ? (
                    <>
                      <li>Comunicação Assertiva</li>
                      <li>Storytelling para Negócios</li>
                      <li>Técnicas de Apresentação e Oratória</li>
                    </>
                  ) : latestTest.radarData && latestTest.radarData.length > 0 && 
                     latestTest.radarData.sort((a, b) => a.value - b.value)[0].subject === "Trabalho em Equipe" ? (
                    <>
                      <li>Colaboração e Trabalho em Equipe</li>
                      <li>Gestão de Conflitos</li>
                      <li>Inteligência Coletiva</li>
                    </>
                  ) : (
                    <>
                      <li>Liderança Situacional</li>
                      <li>Metodologias Ágeis para Gestão</li>
                      <li>Inteligência Emocional Aplicada</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientProfile;
