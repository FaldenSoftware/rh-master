
import { useToast } from "@/hooks/use-toast";

export function useNotifications() {
  const { toast } = useToast();
  
  return {
    success: (message: string) => {
      toast({
        title: "Sucesso",
        description: message,
        variant: "default",
        duration: 5000,
      });
    },
    error: (message: string) => {
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
        duration: 7000,
      });
    },
    warning: (message: string) => {
      toast({
        title: "Atenção",
        description: message,
        variant: "default", // Não temos variant "warning" no shadcn
        className: "bg-amber-500 text-white",
        duration: 6000,
      });
    },
    info: (message: string) => {
      toast({
        title: "Informação",
        description: message,
        variant: "default",
        className: "bg-blue-500 text-white",
        duration: 5000,
      });
    }
  };
}

export default useNotifications;
