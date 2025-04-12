
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InviteFormFieldsProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string;
  setClientEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const InviteFormFields = ({
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  onSubmit,
  isSubmitting,
  onCancel
}: InviteFormFieldsProps) => {
  // Email validation function
  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientName">Nome completo</Label>
        <Input
          id="clientName"
          placeholder="Digite o nome do cliente"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientEmail">Email</Label>
        <Input
          id="clientEmail"
          type="email"
          placeholder="cliente@empresa.com"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          required
          className={!clientEmail || isEmailValid(clientEmail) ? "" : "border-red-500"}
        />
        {clientEmail && !isEmailValid(clientEmail) && (
          <p className="text-sm text-red-500 mt-1">Por favor, insira um email válido</p>
        )}
      </div>
      
      <div className="pt-2 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !clientName || !clientEmail || !isEmailValid(clientEmail)}
        >
          {isSubmitting ? "Enviando..." : "Enviar Convite"}
        </Button>
      </div>
    </form>
  );
};

export default InviteFormFields;
