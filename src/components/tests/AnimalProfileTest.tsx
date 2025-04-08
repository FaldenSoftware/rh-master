
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowRight, Brain } from "lucide-react";
import {
  AnimalProfileQuestion,
  fetchAnimalProfileQuestions,
  createAnimalProfileResult,
  saveAnimalProfileAnswer,
  finalizeAnimalProfileResult,
  shuffleAnswers,
  markClientTestCompleted
} from "@/lib/animalProfileService";

const AnimalProfileTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<AnimalProfileQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<Array<{text: string, animal: string}>>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [scores, setScores] = useState({
    tubarao: 0,
    gato: 0,
    lobo: 0,
    aguia: 0
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const questionsData = await fetchAnimalProfileQuestions();
        setQuestions(questionsData);
        
        if (questionsData.length > 0) {
          setShuffledOptions(shuffleAnswers(questionsData[0]));
          
          // Create a new result record
          if (user) {
            const newResultId = await createAnimalProfileResult(user.id);
            setResultId(newResultId);
          }
        }
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          title: "Erro ao carregar perguntas",
          description: "Ocorreu um erro ao carregar as perguntas do teste.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadQuestions();
    }
  }, [user, toast]);

  // Handle option selection
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  // Handle next question button click
  const handleNextQuestion = async () => {
    if (!selectedOption || !resultId || !user) return;
    
    setSubmitting(true);
    
    try {
      const currentQuestion = questions[currentQuestionIndex];
      
      // Save answer
      await saveAnimalProfileAnswer(resultId, currentQuestion.id, selectedOption);
      
      // Update scores
      const newScores = { ...scores };
      newScores[selectedOption as keyof typeof scores] += 1;
      setScores(newScores);
      
      // Move to next question or finish test
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setShuffledOptions(shuffleAnswers(questions[currentQuestionIndex + 1]));
      } else {
        // Final question - calculate results
        const result = await finalizeAnimalProfileResult(resultId, newScores);
        
        // Mark the test as completed in client_tests
        await markClientTestCompleted(user.id);
        
        // Navigate to results page
        navigate(`/client/tests/animal-profile/results/${resultId}`);
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      toast({
        title: "Erro ao salvar resposta",
        description: "Ocorreu um erro ao salvar sua resposta.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
        <p className="text-muted-foreground">Carregando perguntas do teste...</p>
      </div>
    );
  }

  // Error state - no questions found
  if (questions.length === 0) {
    return (
      <div className="text-center p-8">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma pergunta encontrada</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          Não foi possível carregar as perguntas do teste. Por favor, tente novamente mais tarde.
        </p>
        <Button onClick={() => navigate("/client/tests")}>Voltar para Testes</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-gray-50 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Brain className="h-5 w-5" />
            <span>Teste de Perfil - Animais</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Pergunta {currentQuestionIndex + 1} de {questions.length}
          </div>
        </div>
        <CardTitle className="mt-4 text-lg md:text-xl">
          {currentQuestion.pergunta}
        </CardTitle>
        <CardDescription className="mt-2">
          Selecione a alternativa que melhor descreve você.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <RadioGroup value={selectedOption || ""} onValueChange={handleOptionChange} className="space-y-4">
          {shuffledOptions.map((option, index) => (
            <div key={option.animal} className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50">
              <RadioGroupItem value={option.animal} id={`option-${index}`} className="mt-1" />
              <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 py-4">
        <Button 
          onClick={handleNextQuestion} 
          disabled={!selectedOption || submitting}
          className="w-full md:w-auto ml-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : currentQuestionIndex < questions.length - 1 ? (
            <>
              Próxima Pergunta
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Finalizar Teste
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnimalProfileTest;
