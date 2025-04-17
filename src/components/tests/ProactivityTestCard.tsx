
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, LineChart, Loader2 } from "lucide-react";
import { ClientTest } from "@/types/models";
import { useQueryClient } from "@tanstack/react-query";

interface ProactivityTestCardProps {
  test: ClientTest;
  isStarting: boolean;
  onStartTest: (testId: string) => void;
}

const ProactivityTestCard = ({ test, isStarting, onStartTest }: ProactivityTestCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const handleViewResults = () => {
    // Invalidate queries before navigation to ensure data is up-to-date
    queryClient.invalidateQueries({ queryKey: ['clientTests'] });
    queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    queryClient.invalidateQueries({ queryKey: ['testResults'] });
    queryClient.invalidateQueries({ queryKey: ['proactivityResults'] });
    
    navigate(`/client/tests/proactivity/results/latest`);
  };
  
  const completedDate = test.completed_at 
    ? new Date(test.completed_at).toLocaleDateString('pt-BR') 
    : "Data não registrada";
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 pb-4">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={test.is_completed ? 
            "bg-green-50 text-green-600 border-green-200" : 
            "bg-amber-50 text-amber-600 border-amber-200"}>
            {test.is_completed ? "Concluído" : "Pendente"}
          </Badge>
          <div className="flex items-center text-muted-foreground">
            {test.is_completed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                <span className="text-xs text-green-600">
                  Realizado: {completedDate}
                </span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-1 text-amber-600" />
                <span className="text-xs text-amber-600">Prazo: Em aberto</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-start gap-3 mt-3">
          <div className="bg-purple-100 p-2 rounded-md">
            <LineChart className="h-6 w-6 text-brand-gold" />
          </div>
          <div>
            <CardTitle className="text-lg">Formulário de Proatividade</CardTitle>
            <CardDescription className="mt-1">
              Avalie seu nível de proatividade e iniciativa no ambiente de trabalho.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">
                {test.is_completed ? "100%" : (test.started_at ? "Iniciado" : "0%")}
              </span>
            </div>
            <Progress value={test.is_completed ? 100 : (test.started_at ? 30 : 0)} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Tempo estimado: 8 minutos</span>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-brand-gold border-brand-gold/20">
              profissional
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 py-3">
        {test.is_completed ? (
          <Button variant="outline" className="w-full" onClick={handleViewResults}>
            Ver Resultados
          </Button>
        ) : (
          <Button 
            className="w-full bg-brand-gold hover:bg-brand-gold/90" 
            onClick={() => onStartTest(test.id)}
            disabled={isStarting}
          >
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando...
              </>
            ) : test.started_at ? "Continuar Teste" : "Iniciar Teste"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProactivityTestCard;
