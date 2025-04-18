
import { Loader2 } from "lucide-react";

const LoadingTests = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-brand-teal mb-4" />
      <p className="text-muted-foreground">Carregando seus testes...</p>
    </div>
  );
};

export default LoadingTests;
