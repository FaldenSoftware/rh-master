
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Copy } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ClientInviteFormProps {
  onCancel: () => void;
}

const ClientInviteForm = ({ onCancel }: ClientInviteFormProps) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const { user } = useAuth();

  const generateInviteLink = (mentorId: string, email: string) => {
    // Codificar o email e ID do mentor nos parâmetros da URL
    const params = new URLSearchParams();
    params.append("mentor", mentorId);
    params.append("email", email);
    
    // Criar URL completa (usar window.location.origin para pegar a base da URL atual)
    const baseUrl = window.location.origin;
    return `${baseUrl}/client/register?${params.toString()}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Link copiado para a área de transferência");
    } catch (err) {
      toast.error("Erro ao copiar link");
      console.error("Falha ao copiar:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!clientName.trim() || !clientEmail.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      toast.error("Por favor, informe um email válido");
      return;
    }
    
    if (!user) {
      toast.error("Você precisa estar logado para convidar clientes");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Gerar o link de convite
      const link = generateInviteLink(user.id, clientEmail);
      setInviteLink(link);
      
      // Salvar o convite no banco de dados (em um caso real)
      // Aqui você poderia implementar o envio por email usando uma Edge Function
      
      toast.success(`Convite gerado para ${clientName}`);
    } catch (error) {
      console.error("Erro ao gerar convite:", error);
      toast.error("Erro ao gerar convite");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Convidar Novo Cliente</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {!inviteLink ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome completo</Label>
            <Input
              id="clientName"
              placeholder="Digite o nome do cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
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
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Gerando..." : "Gerar Link de Convite"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Link de convite gerado!</h4>
            <p className="text-sm text-blue-700 mb-3">
              Compartilhe este link com o cliente para que ele possa se registrar:
            </p>
            <div className="flex items-center gap-2">
              <Input 
                value={inviteLink} 
                readOnly 
                className="text-xs bg-white"
              />
              <Button 
                type="button" 
                size="icon" 
                variant="outline" 
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Fechar
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                setInviteLink("");
                setClientName("");
                setClientEmail("");
              }}
            >
              Gerar Novo Convite
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInviteForm;
