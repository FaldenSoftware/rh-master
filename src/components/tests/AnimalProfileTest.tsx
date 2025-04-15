
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowRight, Brain } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AnimalProfileQuestion,
  fetchAnimalProfileQuestions,
  createAnimalProfileResult,
  saveAnimalProfileAnswer,
  finalizeAnimalProfileResult,
  shuffleAnswers,
  markClientTestCompleted
} from "@/lib/animalProfileService";

const MIN_QUESTIONS = 10; // Minimum number of questions required

const AnimalProfileTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
  const [tieBreakQuestions, setTieBreakQuestions] = useState<AnimalProfileQuestion[]>([]);
  const [isTieBreak, setIsTieBreak] = useState(false);

  const loadQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const questionsData = await fetchAnimalProfileQuestions();
      
      if (questionsData.length < MIN_QUESTIONS) {
        toast({
          title: "Aviso",
          description: `Precisamos de pelo menos ${MIN_QUESTIONS} perguntas para o teste, mas só temos ${questionsData.length}. Algumas perguntas podem se repetir.`,
          variant: "warning",
        });
        
        // Clone questions if we don't have enough
        let extendedQuestions = [...questionsData];
        while (extendedQuestions.length < MIN_QUESTIONS) {
          // Add copies of existing questions with slight modifications
          const additionalQuestions = questionsData.map(q => ({
            ...q,
            id: `${q.id}-copy-${Math.random().toString(36).substring(7)}`, // Create a unique ID
            pergunta: `${q.pergunta} (continuação)` // Slightly modify the question
          }));
          extendedQuestions = [...extendedQuestions, ...additionalQuestions];
        }
        
        // Take exactly MIN_QUESTIONS
        extendedQuestions = extendedQuestions.slice(0, MIN_QUESTIONS);
        
        // Use all questions for the main test
        setQuestions(extendedQuestions);
        setTieBreakQuestions([]);
      } else {
        // Divide questions: MIN_QUESTIONS for main test, rest for tie-breaking
        const mainQuestions = questionsData.slice(0, MIN_QUESTIONS);
        const reservedQuestions = questionsData.slice(MIN_QUESTIONS);
        
        setQuestions(mainQuestions);
        setTieBreakQuestions(reservedQuestions);
      }
      
      // Initialize with first question
      if (questionsData.length > 0) {
        setShuffledOptions(shuffleAnswers(questionsData[0]));
        
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
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      loadQuestions();
    }
  }, [user, loadQuestions]);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const checkForTie = () => {
    const { tubarao, gato, lobo, aguia } = scores;
    const maxScore = Math.max(tubarao, gato, lobo, aguia);
    const tieCandidates = [];

    if (tubarao === maxScore) tieCandidates.push('tubarao');
    if (gato === maxScore) tieCandidates.push('gato');
    if (lobo === maxScore) tieCandidates.push('lobo');
    if (aguia === maxScore) tieCandidates.push('aguia');

    return tieCandidates.length > 1 ? tieCandidates : null;
  };

  const handleNextQuestion = async () => {
    if (!selectedOption || !resultId || !user) return;
    
    setSubmitting(true);
    
    try {
      const currentQuestions = isTieBreak ? tieBreakQuestions : questions;
      const currentQuestion = currentQuestions[currentQuestionIndex];
      
      await saveAnimalProfileAnswer(resultId, currentQuestion.id, selectedOption);
      
      const newScores = { ...scores };
      newScores[selectedOption as keyof typeof scores] += 1;
      setScores(newScores);
      
      const isLastMainQuestion = !isTieBreak && currentQuestionIndex === questions.length - 1;
      const isLastTieBreakQuestion = isTieBreak && currentQuestionIndex === tieBreakQuestions.length - 1;
      
      // If we've reached the end of the main questions, check for a tie
      if (isLastMainQuestion) {
        const tieCandidates = checkForTie();
        
        if (tieCandidates && tieBreakQuestions.length > 0) {
          // Need tie-break questions
          setIsTieBreak(true);
          setCurrentQuestionIndex(0);
          setSelectedOption(null);
          setShuffledOptions(shuffleAnswers(tieBreakQuestions[0]));
          
          toast({
            title: "Desempate necessário",
            description: "Algumas perguntas adicionais ajudarão a definir seu perfil predominante.",
          });
        } else {
          // No tie or no tie-break questions available, finalize the test
          await finalizeTestAndNavigate(newScores);
        }
      } 
      // If we're at the end of tie-break questions, check for a tie again
      else if (isLastTieBreakQuestion) {
        const tieCandidates = checkForTie();
        
        if (tieCandidates && tieCandidates.length > 1) {
          // Still have a tie after all questions, determine a winner by highest score
          await finalizeTestAndNavigate(newScores);
        } else {
          // Tie resolved, finalize test
          await finalizeTestAndNavigate(newScores);
        }
      } else {
        // More questions available, move to the next one
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(null);
        const nextQuestions = isTieBreak ? tieBreakQuestions : questions;
        setShuffledOptions(shuffleAnswers(nextQuestions[currentQuestionIndex + 1]));
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

  const finalizeTestAndNavigate = async (finalScores: typeof scores) => {
    try {
      console.log("Finalizing test with scores:", finalScores);
      
      // Determine predominant animal by highest score
      const { tubarao, gato, lobo, aguia } = finalScores;
      const maxScore = Math.max(tubarao, gato, lobo, aguia);
      
      // Find all animals that have the max score
      const tiedAnimals = [];
      if (tubarao === maxScore) tiedAnimals.push('tubarao');
      if (gato === maxScore) tiedAnimals.push('gato');
      if (lobo === maxScore) tiedAnimals.push('lobo');
      if (aguia === maxScore) tiedAnimals.push('aguia');
      
      // If still tied, choose randomly between tied animals
      let predominantAnimal = '';
      if (tiedAnimals.length > 1) {
        // Pick a random animal from the tied ones
        const randomIndex = Math.floor(Math.random() * tiedAnimals.length);
        predominantAnimal = tiedAnimals[randomIndex];
        console.log("Multiple animals tied with max score. Randomly selected:", predominantAnimal);
      } else {
        predominantAnimal = tiedAnimals[0];
      }
      
      if (!resultId) {
        toast({
          title: "Erro ao finalizar teste",
          description: "Não foi possível identificar o resultado do teste.",
          variant: "destructive",
        });
        return;
      }
      
      // Save the final result with the designated predominant animal
      const result = await finalizeAnimalProfileResult(resultId, finalScores, predominantAnimal);
      
      if (!user) {
        toast({
          title: "Erro ao finalizar teste",
          description: "Usuário não identificado.",
          variant: "destructive",
        });
        return;
      }
      
      // Mark the client test as completed in the database
      const testCompleted = await markClientTestCompleted(user.id);
      console.log("Test marked as completed:", testCompleted);
      
      // Invalidate queries to force re-fetch of data
      queryClient.invalidateQueries({ queryKey: ['clientTests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['testResults'] });
      queryClient.invalidateQueries({ queryKey: ['animalProfileResults'] });
      
      // Show success message
      toast({
        title: "Teste concluído com sucesso!",
        description: "Você será redirecionado para ver seus resultados.",
      });
      
      // Navigate to results page
      navigate(`/client/tests/animal-profile/results/${resultId}`);
    } catch (error) {
      console.error("Error finalizing test:", error);
      toast({
        title: "Erro ao finalizar teste",
        description: "Ocorreu um erro ao finalizar seu teste, mas suas respostas foram salvas.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
        <p className="text-muted-foreground">Carregando perguntas do teste...</p>
      </div>
    );
  }

  const currentQuestions = isTieBreak ? tieBreakQuestions : questions;
  
  if (currentQuestions.length === 0) {
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

  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  // Calculate progress differently for tie-break mode
  const totalQuestions = isTieBreak ? 
    questions.length + tieBreakQuestions.length : 
    questions.length;
  
  const progress = isTieBreak ? 
    ((questions.length + currentQuestionIndex + 1) / totalQuestions) * 100 :
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-gray-50 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Brain className="h-5 w-5" />
            <span>Teste de Perfil - Animais</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {isTieBreak ? (
              <span>Pergunta de desempate {currentQuestionIndex + 1}</span>
            ) : (
              <span>Pergunta {currentQuestionIndex + 1} de {questions.length}</span>
            )}
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
          ) : currentQuestionIndex < (isTieBreak ? tieBreakQuestions.length - 1 : questions.length - 1) || isTieBreak ? (
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
