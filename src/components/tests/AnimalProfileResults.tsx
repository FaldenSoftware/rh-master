import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  Loader2,
  AlertCircle,
  Award,
  FileDown
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  AnimalProfileResult, 
  getAnimalProfileResult,
  animalProfiles
} from "@/lib/animalProfileService";
import { generateAnimalProfilePDF } from "@/lib/pdfGenerator";

interface AnimalProfileResultsProps {
  resultId?: string | null;
}

const AnimalProfileResults = ({ resultId }: AnimalProfileResultsProps = {}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [result, setResult] = useState<AnimalProfileResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadResult = async () => {
      try {
        setIsLoading(true);
        if (!resultId || !user) return;
        
        const resultData = await getAnimalProfileResult(resultId);
        setResult(resultData);
      } catch (error) {
        console.error("Error loading result:", error);
        toast({
          title: "Erro ao carregar resultados",
          description: "Não foi possível carregar os resultados do teste.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadResult();
    }
  }, [resultId, user, toast]);

  const handleGeneratePDF = async () => {
    if (!result || !user) return;
    
    try {
      setIsGeneratingPDF(true);
      
      await generateAnimalProfilePDF(result, user);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O relatório foi baixado para o seu dispositivo.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o relatório em PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
        <p className="text-muted-foreground">Carregando seus resultados...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Resultado não encontrado. O teste pode não ter sido concluído corretamente.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/client/tests")}>
          Voltar para meus testes
        </Button>
      </div>
    );
  }

  const animals = result.animal_predominante.split('-');
  
  const scoreData = [
    { name: "Tubarão (Executor)", value: result.score_tubarao, color: "#F59E0B" },
    { name: "Gato (Comunicador)", value: result.score_gato, color: "#10B981" },
    { name: "Lobo (Organizador)", value: result.score_lobo, color: "#3B82F6" },
    { name: "Águia (Idealizador)", value: result.score_aguia, color: "#8B5CF6" }
  ];
  
  const barChartData = [
    { name: "Tubarão", pontuação: result.score_tubarao, fill: "#F59E0B" },
    { name: "Gato", pontuação: result.score_gato, fill: "#10B981" },
    { name: "Lobo", pontuação: result.score_lobo, fill: "#3B82F6" },
    { name: "Águia", pontuação: result.score_aguia, fill: "#8B5CF6" }
  ];
  
  const radarChartData = [
    { subject: "Executor", A: result.score_tubarao, fullMark: 10 },
    { subject: "Comunicador", A: result.score_gato, fullMark: 10 },
    { subject: "Organizador", A: result.score_lobo, fullMark: 10 },
    { subject: "Idealizador", A: result.score_aguia, fullMark: 10 }
  ];
  
  const mainResults = animals.map(animal => {
    const animalKey = animal as keyof typeof animalProfiles;
    return animalProfiles[animalKey];
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-900 text-white">
          <div className="flex justify-between items-start">
            <Badge variant="secondary" className="bg-white text-purple-700">
              Resultado
            </Badge>
            <div className="text-sm">
              Concluído em: {new Date(result.completed_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
            <div className="flex-shrink-0 flex justify-center items-center bg-white text-6xl rounded-full w-24 h-24">
              {animals.length === 1 ? (
                <span>{animalProfiles[animals[0] as keyof typeof animalProfiles].emoji}</span>
              ) : (
                <Award className="h-12 w-12 text-purple-600" />
              )}
            </div>
            
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold">
                {animals.length > 1
                  ? `Seu perfil é híbrido: ${animals.map(a => animalProfiles[a as keyof typeof animalProfiles].name).join(' e ')}`
                  : `Seu perfil é: ${animalProfiles[animals[0] as keyof typeof animalProfiles].name}`
                }
              </CardTitle>
              <CardDescription className="text-purple-100 mt-2 text-lg">
                {animals.length > 1
                  ? `Uma combinação de ${animals.map(a => animalProfiles[a as keyof typeof animalProfiles].title).join(' e ')}`
                  : animalProfiles[animals[0] as keyof typeof animalProfiles].title
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="charts">Gráficos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="text-lg">
                {animals.length > 1 
                  ? "Por ter pontuações iguais em mais de um perfil, você apresenta uma combinação única dessas características:"
                  : animalProfiles[animals[0] as keyof typeof animalProfiles].description
                }
              </div>
              
              {mainResults.map((profile, index) => (
                <div key={`profile-${index}`} className="mt-6">
                  {mainResults.length > 1 && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{profile.emoji}</span>
                      <h3 className="text-xl font-medium">{profile.name} ({profile.title})</h3>
                    </div>
                  )}
                  
                  <p className="mb-4">{profile.description}</p>
                  
                  <h4 className="font-medium text-lg mt-4">Principais Características:</h4>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    {profile.characteristics.map((char, i) => (
                      <li key={`char-${index}-${i}`}>{char}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              {mainResults.map((profile, index) => (
                <div key={`details-${index}`} className="space-y-4">
                  {mainResults.length > 1 && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{profile.emoji}</span>
                      <h3 className="text-xl font-medium">{profile.name} ({profile.title})</h3>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Pontos Fortes</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {profile.strengths.map((strength, i) => (
                          <li key={`strength-${index}-${i}`}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Desafios</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {profile.challenges.map((challenge, i) => (
                          <li key={`challenge-${index}-${i}`}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">Recomendações para Desenvolvimento</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      {profile.recommendations.map((rec, i) => (
                        <li key={`rec-${index}-${i}`}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {index < mainResults.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="charts" className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Distribuição dos Perfis</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Pontuação por Perfil</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="pontuação" name="Pontuação" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Radar de Características</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} />
                      <Radar
                        name="Seu perfil"
                        dataKey="A"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t bg-gray-50 py-4">
          <div className="flex flex-wrap gap-3 w-full">
            <Button variant="outline" onClick={() => navigate("/client/tests")} className="mr-auto">
              Voltar para Testes
            </Button>
            
            <Button variant="outline" onClick={() => handleGeneratePDF()} disabled={isGeneratingPDF}>
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Relatório
                </>
              )}
            </Button>
            
            <Button onClick={() => handleGeneratePDF()} disabled={isGeneratingPDF}>
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar PDF
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AnimalProfileResults;
