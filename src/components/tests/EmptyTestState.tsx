
import { ClipboardCheck, CheckCircle } from "lucide-react";

interface EmptyTestStateProps {
  type: "pending" | "completed";
}

const EmptyTestState = ({ type }: EmptyTestStateProps) => {
  const isPending = type === "pending";
  
  return (
    <div className="text-center py-8">
      <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
        {isPending ? (
          <ClipboardCheck className="h-6 w-6 text-gray-500" />
        ) : (
          <CheckCircle className="h-6 w-6 text-gray-500" />
        )}
      </div>
      <h3 className="text-lg font-medium mb-2">
        {isPending ? "Nenhum teste pendente" : "Nenhum teste concluído"}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        {isPending
          ? "Você não tem nenhum teste pendente no momento. Todos os seus testes serão exibidos aqui quando estiverem disponíveis."
          : "Você ainda não concluiu nenhum teste. Após concluir seus testes, eles serão exibidos aqui com seus resultados."}
      </p>
    </div>
  );
};

export default EmptyTestState;
