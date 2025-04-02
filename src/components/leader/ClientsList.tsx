
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface ClientsListProps {
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ onEdit, onDelete }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchClientsData();
  }, []);

  // Função para buscar clientes
  const fetchClients = async () => {
    try {
      // Buscar perfis com role=client
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client');
      
      if (error) {
        throw error;
      }
      
      // Verificar se temos emails - estamos juntando auth.users e profiles
      const clientsWithEmail = await Promise.all(
        (data || []).map(async (profile) => {
          // Buscar o usuário associado para obter o email
          const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
          return {
            ...profile,
            email: userData?.user?.email || 'Email não disponível'
          };
        })
      );
      
      return clientsWithEmail || [];
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  };

  const fetchClientsData = async () => {
    try {
      const clientsData = await fetchClients();
      setClients(clientsData as Client[]);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar clientes",
        description: error.message || "Ocorreu um erro ao carregar a lista de clientes.",
        variant: "destructive",
      });
    }
  };

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
