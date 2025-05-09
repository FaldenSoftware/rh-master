import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { questions } from './animalProfile/questions';
import { profiles } from "./animalProfile/profiles";
import { calculateAnimalProfile } from "./animalProfile/calculator";

interface AnimalProfileTestProps {
  clientTestId: string;
}

const AnimalProfileTest: React.FC<AnimalProfileTestProps> = ({ clientTestId }) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentAnswer) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentQuestion].id]: currentAnswer
      }));
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setCurrentAnswer(null);
      } else {
        setIsSubmitting(true);

        (async () => {
          try {
            const resultData = calculateProfile();

            const user_id = user?.id;
            const client_test_id = clientTestId;

            if (user_id && client_test_id) {
              const { saveTestResult } = await import('@/services/testResultsService');
              
              await saveTestResult({
                user_id,
                client_test_id,
                data: {
                  dominantProfile: resultData.dominantProfile,
                  percentageScore: resultData.percentageScore,
                  profileScores: resultData.profileScores,
                  traits: resultData.traits,
                  answers: answers,
                },
              });

              // Atualizar status do teste para concluído
              const { supabase } = await import('@/integrations/supabase/client');
              await supabase
                .from('client_tests')
                .update({ is_completed: true, completed_at: new Date().toISOString() })
                .eq('id', client_test_id);

            } else {
              console.error('User ID ou Client Test ID não encontrado. Não foi possível salvar o resultado.');
            }
          } catch (e) {
            console.error('Erro ao salvar resultado do teste:', e);
          } finally {
            setShowResults(true);
            setIsSubmitting(false);
          }
        })();
      }
    }
  };

  const calculateProfile = () => {
    const traits = {
      dinâmico: 0,
      expressivo: 0,
      analítico: 0,
      preciso: 0,
      amigável: 0,
      estável: 0,
      cauteloso: 0
    };
    let totalPoints = 0;
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.id === answerId);
        if (option && option.traits) {
          Object.entries(option.traits).forEach(([trait, score]) => {
            traits[trait as keyof typeof traits] += score as number;
            totalPoints += score as number;
          });
        }
      }
    });
    const profileScores = {
      águia: (traits.dinâmico + traits.expressivo) / 2,
      lobo: (traits.analítico + traits.preciso) / 2,
      golfinho: (traits.expressivo + traits.amigável) / 2,
      coruja: (traits.estável + traits.cauteloso) / 2
    };
    let dominantProfile = Object.entries(profileScores).reduce(
      (max, [profile, score]) => score > max.score ? { profile, score } : max,
      { profile: '', score: 0 }
    );
    const maxPossibleScore = Object.values(traits).length * 3 * (Object.keys(answers).length / Object.values(traits).length); 
    const percentageScore = Math.round((totalPoints / maxPossibleScore) * 100);
    const sortedProfiles = Object.entries(profileScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([profile, score]) => ({
        profile,
        score,
        percentage: Math.round((score / (Object.values(profileScores).reduce((a, b) => a + b, 0))) * 100)
      }));
    return {
      dominantProfile: dominantProfile.profile,
      percentageScore: Math.min(percentageScore, 100),
      profileScores: sortedProfiles,
      traits
    };
  };

  if (showResults) {
    const result = calculateAnimalProfile(answers, questions);
    const dominantProfile = profiles[result.dominantProfile];
    
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Resultados do Perfil Comportamental</CardTitle>
          <CardDescription>Seu perfil comportamental dominante</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-brand-teal mb-2">{dominantProfile.name}</div>
            <div className="text-xl font-semibold text-brand-gold mb-4">{result.percentageScore}% de compatibilidade</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className={cn("h-3 rounded-full", dominantProfile.color)} style={{ width: `${result.percentageScore}%` }}></div>
          </div>
          <Alert className="mt-4 bg-brand-beige border-brand-gold text-brand-teal">
            <p>{dominantProfile.description}</p>
          </Alert>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Pontos fortes:</h3>
            <p>{dominantProfile.strengths}</p>
            
            <h3 className="text-lg font-semibold mb-3 mt-4">Desafios:</h3>
            <p>{dominantProfile.challenges}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Distribuição do seu perfil:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.profileScores.map(({ profile, percentage }) => (
                <div key={profile} className="border rounded-lg p-3">
                  <div className="font-medium">{profiles[profile as keyof typeof profiles].name}</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn("h-2 rounded-full", profiles[profile as keyof typeof profiles].color)} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           <Button className="w-full bg-brand-teal hover:bg-brand-teal/90" onClick={() => {
             setShowResults(false);
             setCurrentQuestion(0);
             setAnswers({});
           }}>
             Refazer Teste
           </Button>
           <Button variant="outline" className="w-full" onClick={() => window.location.href = '/client/dashboard'}>
             Voltar ao Dashboard
           </Button>
         </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl">Perfil Comportamental</CardTitle>
            <CardDescription>Questão {currentQuestion + 1} de {questions.length}</CardDescription>
          </div>
          <div className="text-sm font-medium">
            {Math.round(((currentQuestion) / questions.length) * 100)}% Completo
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-brand-teal h-2.5 rounded-full" style={{ width: `${(currentQuestion / questions.length) * 100}%` }}></div>
        </div>
      </CardHeader>
      <CardContent>        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</h3>
          <RadioGroup value={currentAnswer || ""} onValueChange={setCurrentAnswer}>
            <div className="space-y-3">
              {questions[currentQuestion].options.map(option => (
                <div key={option.id} className="flex items-center space-x-2 border border-gray-200 p-3 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="cursor-pointer">{option.text}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-brand-teal hover:bg-brand-teal/90" 
          onClick={handleNext} 
          disabled={!currentAnswer || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Próxima Questão'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnimalProfileTest;
