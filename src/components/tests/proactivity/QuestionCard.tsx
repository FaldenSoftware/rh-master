
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ProactivityQuestion } from './questions';

interface QuestionCardProps {
  currentQuestion: number;
  totalQuestions: number;
  question: ProactivityQuestion;
  currentAnswer: string | null;
  isSubmitting: boolean;
  onAnswer: (answer: string) => void;
  onNext: () => void;
}

const QuestionCard = ({
  currentQuestion,
  totalQuestions,
  question,
  currentAnswer,
  isSubmitting,
  onAnswer,
  onNext
}: QuestionCardProps) => {
  const progress = Math.round((currentQuestion / totalQuestions) * 100);
  
  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl">Formulário de Proatividade</CardTitle>
            <CardDescription>Questão {currentQuestion + 1} de {totalQuestions}</CardDescription>
          </div>
          <div className="text-sm font-medium">
            {progress}% Completo
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-brand-teal h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
          <RadioGroup 
            value={currentAnswer || ""} 
            onValueChange={onAnswer} 
            className="mt-4"
          >
            <div className="space-y-3">
              {question.options.map(option => (
                <div 
                  key={option.id} 
                  className="flex items-center space-x-2 border border-gray-200 p-3 rounded-md hover:bg-gray-50"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label 
                    htmlFor={option.id} 
                    className="flex-grow cursor-pointer"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-brand-teal hover:bg-brand-teal/80" 
          onClick={onNext} 
          disabled={!currentAnswer || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : currentQuestion === totalQuestions - 1 ? 'Ver Resultados' : 'Próxima Questão'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
