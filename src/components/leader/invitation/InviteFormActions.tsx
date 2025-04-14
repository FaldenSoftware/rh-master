
import React from "react";
import { Button } from "@/components/ui/button";

interface InviteFormActionsProps {
  onCancel: () => void;
  onReset?: () => void;
  isSuccess?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
}

const InviteFormActions: React.FC<InviteFormActionsProps> = ({
  onCancel,
  onReset,
  isSuccess = false,
  submitLabel = "Enviar Convite",
  cancelLabel = "Cancelar",
  resetLabel = "Enviar Novo Convite"
}) => {
  return (
    <div className="pt-2 flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        {isSuccess ? "Fechar" : cancelLabel}
      </Button>
      
      {isSuccess && onReset ? (
        <Button type="button" onClick={onReset}>
          {resetLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default InviteFormActions;
