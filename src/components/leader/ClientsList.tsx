
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash, UserX } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";
import { getMentorClients } from "@/lib/batchQueries";

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
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      fetchClientsData();
    }
  }, [user]);

  // Function to fetch clients using our new security definer functions
  const fetchClients = async () => {
    try {
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }

      // Fetch clients using our utility function
      const data = await getMentorClients(user.id);
      
      // If we don't have data, return an empty array
      if (!data || data.length === 0) {
        return [];
      }
      
      // Format the data
      const formattedClients = (data || []).map((profile: Profile) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email || 'Email não disponível',
        company: profile.company
      }));
      
      return formattedClients;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  };

  const fetchClientsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const clientsData = await fetchClients();
      setClients(clientsData as Client[]);
    } catch (error: any) {
      console.error("Erro ao carregar clientes:", error);
      setError(error.message || "Ocorreu um erro ao carregar a lista de clientes.");
      toast({
        title: "Erro ao carregar clientes",
        description: error.message || "Ocorreu um erro ao carregar a lista de clientes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Erro ao carregar clientes</p>
        <p className="text-sm">{error}</p>
        <Button 
          onClick={fetchClientsData} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          Tentar novamente
        </Button>
      </div>
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
