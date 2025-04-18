import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, UserPlus, Mail } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Client = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_login?: string;
  position?: string;
};

export function ClientsList() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const loadClients = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Buscar clientes associados a este mentor
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client")
        .eq("mentor_id", user.id)
        .order("name");
        
      if (error) throw error;
      
      setClients(data || []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadClients();
  }, [user?.id]);
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.position && client.position.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Seus Clientes</CardTitle>
          <CardDescription>
            Gerencie seus clientes e veja seus detalhes
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadClients}
          disabled={isLoading}
        >
          <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="ml-2" asChild>
            <a href="#invite-client">
              <UserPlus className="h-4 w-4 mr-2" />
              Convidar
            </a>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando clientes...</span>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {clients.length === 0
              ? "Você ainda não tem clientes. Convide novos clientes para começar."
              : "Nenhum cliente encontrado com os critérios de busca."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.position || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(client.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`mailto:${client.email}`}>
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Enviar email</span>
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ClientsList;
