
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ResultsCardProps {
  result: {
    percentage: number;
    level: string;
    description: string;
    score: number;
    maxScore: number;
  };
  totalQuestions: number;
  answeredQuestions: number;
  onRetake: () => void;
}

const ResultsCard = ({ result, totalQuestions, answeredQuestions, onRetake }: ResultsCardProps) => {
  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Resultados do Formulário de Proatividade</CardTitle>
        <CardDescription>Avaliação do seu perfil de proatividade</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="text-6xl font-bold text-brand-teal mb-2">{result.percentage}%</div>
          <p className="text-xl">Pontuação de Proatividade</p>
          <p className="mt-2 text-lg font-semibold text-brand-gold">{result.level}</p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-brand-teal h-3 rounded-full" 
            style={{ width: `${result.percentage}%` }}
          />
        </div>
        
        <Alert className="bg-brand-beige border-brand-gold text-brand-teal mt-4">
          <p>{result.description}</p>
        </Alert>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Detalhes da Pontuação</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border rounded-lg p-3">
              <div className="font-medium">Pontuação Total</div>
              <div className="mt-1">{result.score} de {result.maxScore} pontos</div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="font-medium">Questões Respondidas</div>
              <div className="mt-1">{answeredQuestions} de {totalQuestions}</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-brand-teal hover:bg-brand-teal/80" 
          onClick={onRetake}
        >
          Refazer Teste
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultsCard;
