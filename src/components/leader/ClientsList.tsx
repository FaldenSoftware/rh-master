import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash, UserX, AlertCircle, RefreshCw, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { getMentorClients } from "@/services/clientService";
import { v4 as uuidv4 } from 'uuid';

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface Profile {
  id: string;
  name: string;
  role: string;
  company?: string;
  created_at: string;
  updated_at: string;
  mentor_id?: string;
  email?: string;
}

interface ClientsListProps {
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ onEdit, onDelete }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchClientsData = async () => {
    if (!user || !user.id) {
      setError("Usuário não autenticado");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const clientsData = await getMentorClients(user.id);
      const formattedClients = (clientsData || []).map((profile: Profile) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email || 'Email não disponível',
        company: profile.company
      }));
      setClients(formattedClients as Client[]);
    } catch (error: any) {
      console.error("Erro ao carregar clientes:", error);
      setError(error.message || "Não foi possível carregar a lista de clientes.");
      toast({
        title: "Erro ao carregar clientes",
        description: error.message || "Ocorreu um erro ao carregar a lista de clientes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchClientsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleInviteClient = async (email: string) => {
    try {
      setIsSendingInvite(true);
      setInviteError(null);

      // Gerar um código de convite único (ajuste conforme sua lógica)
      const inviteCode = uuidv4(); // ou obtenha do backend/supabase

      // Inserir código de convite no banco (se necessário)
      const { data: inviteData, error } = await supabase
        .from('invitation_codes')
        .insert([{ code: inviteCode, email, mentor_id: user?.id }])
        .select('code')
        .single();

      if (error) {
        throw new Error(`Erro ao gerar convite: ${error.message}`);
      }

      // Gerar HTML do email de convite
      const { generateInviteEmailHTML } = await import('@/services/emailService');
      const htmlContent = generateInviteEmailHTML(inviteCode, user?.email || 'Equipe RH Mentor Mastery');

      // Enviar email usando Resend
      const { sendInviteEmail } = await import('@/services/emailService');
      await sendInviteEmail(email, undefined, 'Convite para RH Mentor Mastery', htmlContent);

      toast({
        title: 'Convite Enviado',
        description: `Convite enviado com sucesso para ${email}.`,
      });
    } catch (err) {
      console.error('Erro ao enviar convite:', err);
      setInviteError(err instanceof Error ? err.message : 'Erro ao enviar convite. Tente novamente.');
    } finally {
      setIsSendingInvite(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Carregando clientes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar clientes</AlertTitle>
        <AlertDescription>
          <p>{error}</p>
          <p className="text-sm mt-2">
            Isso pode ser causado por um problema de permissões ou conectividade com o banco de dados.
          </p>
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            size="sm" 
            className="mt-2 flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
        <UserX className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Sem clientes</h3>
        <p className="mt-1 text-sm text-gray-500">
          Você ainda não tem clientes registrados. Convide novos clientes para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <Card key={client.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${client.name}.png`} />
                <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">{client.name}</CardTitle>
                <CardDescription className="text-gray-500">{client.email}</CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(client)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(client.id)} className="text-red-500">
                  <Trash className="mr-2 h-4 w-4" /> Excluir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleInviteClient(client.email)} className="text-green-500">
                  <Mail className="mr-2 h-4 w-4" /> Convidar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-medium leading-none">Empresa</h4>
                <p className="text-sm text-gray-500">{client.company || "Não especificada"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium leading-none">Status</h4>
                <Badge variant="secondary">Ativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientsList;
