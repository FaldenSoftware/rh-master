import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ClientLayout from "@/components/client/ClientLayout";
import { useAuth } from "@/context/AuthContext";
import { getTestResult, TestResult } from "@/services/testResultsService";
import { generatePDFFromResultId } from "@/lib/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Loader2, 
  FileDown, 
  AlertCircle, 
  Calendar, 
  Award, 
  ArrowLeft 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { animalProfiles } from "@/lib/animalProfileService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mapeamento de ícones dos animais
const animalIcons = {
  tubarao: '/lovable-uploads/f30d7eb3-1488-45a8-bb1c-81b98ac060bc.png',
  lobo: '/lovable-uploads/132cbcdf-964e-42ae-9313-be4df791d118.png',
  aguia: '/lovable-uploads/b44d9c5c-1f4a-41d3-9416-e555359e608b.png',
  gato: '/lovable-uploads/fa1f3bb8-13ee-41f6-a1a5-a08a1b273fe5.png'
};

const TestResultPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { resultId } = useParams<{ resultId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  useEffect(() => {
    const fetchTestResult = async () => {
      if (!resultId) {
        setError("ID do resultado não fornecido");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const result = await getTestResult(resultId);
        
        if (!result) {
          setError("Resultado não encontrado");
          toast({
            title: "Resultado não encontrado",
            description: "O resultado solicitado não foi encontrado",
            variant: "destructive"
          });
        } else {
          // Verifica se o resultado pertence ao usuário atual (segurança)
          if (user?.id !== result.user_id) {
            setError("Você não tem permissão para visualizar este resultado");
            toast({
              title: "Acesso negado",
              description: "Você não tem permissão para visualizar este resultado",
              variant: "destructive"
            });
            navigate("/client/results");
            return;
          }
          
          setTestResult(result);
        }
      } catch (error: any) {
        console.error("Erro ao buscar resultado do teste:", error);
        setError(error.message || "Erro ao buscar resultado do teste");
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar o resultado do teste",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestResult();
  }, [resultId, user?.id, navigate, toast]);
  
  const handleDownloadPDF = async () => {
    if (!resultId) return;
    
    try {
      setIsGeneratingPDF(true);
      await generatePDFFromResultId(resultId);
      toast({
        title: "PDF gerado com sucesso",
        description: "O PDF foi gerado e baixado com sucesso",
        variant: "default"
      });
    } catch (error: any) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: error.message || "Ocorreu um erro ao gerar o PDF",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data não disponível";
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };
  
  const getTestTitle = () => {
    return testResult?.client_test?.test?.title || "Resultado do Teste";
  };
  
  const determinarAnimalPredominante = (): string => {
    if (!testResult) return "";
    
    const scores = {
      tubarao: testResult.score_tubarao || 0,
      lobo: testResult.score_lobo || 0,
      aguia: testResult.score_aguia || 0,
      gato: testResult.score_gato || 0
    };
    
    let animalPredominante = "";
    let maiorPontuacao = 0;
    
    Object.entries(scores).forEach(([animal, pontuacao]) => {
      if (pontuacao > maiorPontuacao) {
        maiorPontuacao = pontuacao;
        animalPredominante = animal;
      }
    });
    
    return animalPredominante;
  };
  
  const getAnimalData = () => {
    if (!testResult) return [];
    
    return [
      { name: 'Tubarão', valor: testResult.score_tubarao || 0, cor: '#3B82F6' }, // Azul
      { name: 'Lobo', valor: testResult.score_lobo || 0, cor: '#6366F1' }, // Índigo
      { name: 'Águia', valor: testResult.score_aguia || 0, cor: '#8B5CF6' }, // Violeta
      { name: 'Gato', valor: testResult.score_gato || 0, cor: '#EC4899' }, // Rosa
    ];
  };
  
  const getAnimalRadarData = () => {
    if (!testResult) return [];
    
    return [
      {
        perfil: "Perfil",
        tubarao: testResult.score_tubarao || 0,
        lobo: testResult.score_lobo || 0,
        aguia: testResult.score_aguia || 0,
        gato: testResult.score_gato || 0,
      }
    ];
  };
  
  const animalPredominante = determinarAnimalPredominante();
  const animalData = getAnimalData();
  const radarData = getAnimalRadarData();
  
  // Renderiza o estado de carregamento
  if (isLoading) {
    return (
      <ClientLayout title="Carregando Resultado...">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  // Renderiza o estado de erro
  if (error) {
    return (
      <ClientLayout title="Erro ao Carregar Resultado">
        <div className="space-y-4 p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4">
            <Button 
  variant="outline"
  onClick={() => {
    queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    queryClient.invalidateQueries({ queryKey: ['clientTests'] });
    queryClient.invalidateQueries({ queryKey: ['testResults'] });
    navigate('/client/dashboard');
  }}
>
  Voltar ao Dashboard
</Button>
          </div>
        </div>
      </ClientLayout>
    );
  }
  
  // Renderiza se não houver resultado (após carregamento e sem erro)
  if (!testResult) {
     return (
      <ClientLayout title="Resultado Não Encontrado">
        <div className="space-y-4 p-4">
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Resultado não encontrado</AlertTitle>
            <AlertDescription>
              Não foi possível encontrar o resultado para este teste. 
              Verifique se o link está correto ou tente novamente.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4">
            <Button 
  variant="outline"
  onClick={() => {
    queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    queryClient.invalidateQueries({ queryKey: ['clientTests'] });
    queryClient.invalidateQueries({ queryKey: ['testResults'] });
    navigate('/client/dashboard');
  }}
>
  Voltar ao Dashboard
</Button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title={getTestTitle()}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => navigate("/client/results")}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Resultados
          </Button>
          
          <Button 
            onClick={handleDownloadPDF} 
            className="flex items-center gap-2" 
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Baixar PDF
              </>
            )}
          </Button>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{getTestTitle()}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(testResult.created_at)}
                </CardDescription>
              </div>
              
              {animalPredominante && (
                <Badge className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                  Perfil Predominante: {animalPredominante.charAt(0).toUpperCase() + animalPredominante.slice(1)}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-8">
            {/* Resumo do perfil predominante */}
            {animalPredominante && (
              <div className="p-6 border rounded-lg bg-primary/5">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={animalIcons[animalPredominante as keyof typeof animalIcons]} alt={animalPredominante} />
                    <AvatarFallback>{animalPredominante.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="text-xl font-bold">
                      {animalProfiles[animalPredominante as keyof typeof animalProfiles]?.name || animalPredominante}
                    </h3>
                    <p className="text-muted-foreground">
                      {animalProfiles[animalPredominante as keyof typeof animalProfiles]?.title || ""}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {animalProfiles[animalPredominante as keyof typeof animalProfiles]?.description || 
                   "Descrição do perfil predominante não disponível."}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Distribuição do seu perfil</h3>
              <p className="text-sm text-muted-foreground">
                Veja como as características dos diferentes perfis se distribuem na sua avaliação.
              </p>
            </div>
            
            <Tabs defaultValue="barras" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="barras">Gráfico de Barras</TabsTrigger>
                <TabsTrigger value="progresso">Barras de Progresso</TabsTrigger>
                <TabsTrigger value="radar">Gráfico de Radar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="barras" className="pt-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={animalData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Pontuação']} />
                      <Legend />
                      {animalData.map((entry, index) => (
                        <Bar 
                          key={entry.name} 
                          dataKey="valor" 
                          name={entry.name} 
                          fill={entry.cor} 
                          radius={[4, 4, 0, 0]} 
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="progresso" className="pt-4">
                <div className="space-y-6">
                  {animalData.map((animal) => (
                    <div key={animal.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: animal.cor }}></div>
                          <span className="font-medium">{animal.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{animal.valor}%</span>
                      </div>
                      <Progress value={animal.valor} className="h-2" />
                      {/* Note: Usando o componente Progress padrão. Para cores personalizadas, 
                          seria necessário customizar o componente UI Progress ou usar uma abordagem com CSS */}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="radar" className="pt-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="perfil" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar name="Tubarão" dataKey="tubarao" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Radar name="Lobo" dataKey="lobo" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} />
                      <Radar name="Águia" dataKey="aguia" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                      <Radar name="Gato" dataKey="gato" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Características do perfil predominante */}
            {animalPredominante && (
              <div className="mt-8">
                <Separator className="my-4" />
                <h3 className="text-lg font-semibold mb-4">Características principais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      Pontos fortes
                    </h4>
                    <ul className="space-y-2 pl-6 list-disc text-sm text-muted-foreground">
                      {animalProfiles[animalPredominante as keyof typeof animalProfiles]?.strengths?.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      )) || <li>Informações não disponíveis</li>}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      Principais características
                    </h4>
                    <ul className="space-y-2 pl-6 list-disc text-sm text-muted-foreground">
                      {animalProfiles[animalPredominante as keyof typeof animalProfiles]?.characteristics?.map((character, index) => (
                        <li key={index}>{character}</li>
                      )) || <li>Informações não disponíveis</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="bg-muted/20 p-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              ID do resultado: <span className="font-mono">{resultId}</span>
            </div>
            
            <Button 
              onClick={handleDownloadPDF} 
              variant="outline"
              className="flex items-center gap-2" 
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  Baixar PDF
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default TestResultPage;
