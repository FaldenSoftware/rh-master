
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClientLayout from "@/components/client/ClientLayout";
import AnimalProfileResults from "@/components/tests/AnimalProfileResults";
import { useAuth } from "@/context/AuthContext";
import { getUserLatestAnimalProfileResult } from "@/lib/animalProfileService";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const AnimalProfileResultsPage = () => {
  const navigate = useNavigate();
  const { resultId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [latestResultId, setLatestResultId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Se resultId for "latest", busque o resultado mais recente para o usuário
  useEffect(() => {
    const getLatestResult = async () => {
      if (resultId === "latest" && user) {
        try {
          setIsLoading(true);
          const result = await getUserLatestAnimalProfileResult(user.id);
          
          if (result) {
            setLatestResultId(result.id);
          } else {
            toast({
              title: "Nenhum resultado encontrado",
              description: "Você ainda não concluiu nenhum teste de perfil animal.",
              variant: "destructive"
            });
            navigate("/client/tests");
          }
        } catch (error) {
          console.error("Error fetching latest result:", error);
          toast({
            title: "Erro ao buscar resultados",
            description: "Não foi possível carregar seus resultados.",
            variant: "destructive"
          });
          navigate("/client/tests");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    getLatestResult();
  }, [resultId, user, navigate, toast]);
  
  if (isLoading && resultId === "latest") {
    return (
      <ClientLayout title="Resultados do Teste">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-muted-foreground">Carregando seus resultados...</p>
        </div>
      </ClientLayout>
    );
  }
  
  return (
    <ClientLayout title="Resultados do Teste">
      <AnimalProfileResults resultId={resultId !== "latest" ? resultId : latestResultId} />
    </ClientLayout>
  );
};

export default AnimalProfileResultsPage;
