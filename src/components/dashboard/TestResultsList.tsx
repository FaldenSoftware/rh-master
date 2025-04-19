import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import { getUserTestResults } from "@/services/testResultsService";
import { TestResult } from "@/services/testResultsService";
import { generateAnimalProfilePDF } from "@/lib/pdfGenerator";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { AlertCircle, RefreshCw, FileDown, Calendar } from "lucide-react";

const TestResultsList: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTestResults();
  }, [user?.id]);

  const fetchTestResults = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const testResults = await getUserTestResults(user.id);
      setResults(testResults);
    } catch (err) {
      console.error("Erro ao buscar resultados dos testes:", err);
      setError("Não foi possível carregar os resultados dos testes. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = async (result: TestResult) => {
    if (!user) return;

    // Atualiza o estado para mostrar o spinner apenas para este resultado
    setIsGeneratingPDF(prev => ({ ...prev, [result.id!]: true }));

    try {
      // Preparar os dados no formato esperado pela função de geração de PDF
      const animalProfileResult = {
        id: result.id!,
        user_id: user.id,
        score_tubarao: result.score_tubarao || 0,
        score_lobo: result.score_lobo || 0,
        score_aguia: result.score_aguia || 0,
        score_gato: result.score_gato || 0,
        animal_predominante: determinarAnimalPredominante(result),
        completed_at: result.created_at!,
        created_at: result.created_at,
        updated_at: result.updated_at,
        // Incluir respostas se necessário
        answers: result.answers || {}
      };

      await generateAnimalProfilePDF(animalProfileResult, user);

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      setError("Ocorreu um erro ao gerar o PDF. Tente novamente mais tarde.");
    } finally {
      // Remove o spinner para este resultado
      setIsGeneratingPDF(prev => ({ ...prev, [result.id!]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Determina o animal predominante baseado nos scores
  const determinarAnimalPredominante = (result: TestResult): string => {
    const scores = {
      tubarao: result.score_tubarao || 0,
      lobo: result.score_lobo || 0,
      aguia: result.score_aguia || 0,
      gato: result.score_gato || 0
    };
    
    // Encontrar o animal com maior pontuação
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

  // Renderiza o título do teste baseado no client_test
  const getTestTitle = (result: TestResult) => {
    if (result.client_test?.test?.title) {
      return result.client_test.test.title;
    }
    
    // Título padrão caso não encontre
    return "Perfil Comportamental Animal";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando resultados de testes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={fetchTestResults}
        >
          Tentar novamente
        </Button>
      </Alert>
    );
  }

  if (results.length === 0) {
    return (
      <Alert className="my-4">
        <AlertTitle>Nenhum resultado encontrado</AlertTitle>
        <AlertDescription>
          Você ainda não completou nenhum teste. Complete um teste para ver seus resultados aqui.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resultados dos Testes</h2>
        <Button 
          variant="outline" 
          onClick={fetchTestResults}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-primary/5">
              <CardTitle>{getTestTitle(result)}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(result.created_at || '')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tubarão</span>
                    <span className="text-sm text-muted-foreground">{result.score_tubarao || 0}%</span>
                  </div>
                  <Progress value={result.score_tubarao || 0} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Gato</span>
                    <span className="text-sm text-muted-foreground">{result.score_gato || 0}%</span>
                  </div>
                  <Progress value={result.score_gato || 0} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Lobo</span>
                    <span className="text-sm text-muted-foreground">{result.score_lobo || 0}%</span>
                  </div>
                  <Progress value={result.score_lobo || 0} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Águia</span>
                    <span className="text-sm text-muted-foreground">{result.score_aguia || 0}%</span>
                  </div>
                  <Progress value={result.score_aguia || 0} className="h-2" />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/20 px-6 py-4">
              <Button 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleGeneratePDF(result)}
                disabled={isGeneratingPDF[result.id!]}
              >
                {isGeneratingPDF[result.id!] ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
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
        ))}
      </div>
    </div>
  );
};

export default TestResultsList;
