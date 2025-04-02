
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Search, RefreshCcw, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: "ativo" | "inativo" | "pendente";
  lastTest?: string;
  completedTests: number;
}

const ClientsList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar clientes do mentor atual
  const fetchClients = async (): Promise<Client[]> => {
    if (!user) {
      return [];
    }

    try {
      // Buscar testes do mentor
      const { data: mentorTests, error: testsError } = await supabase
        .from('tests')
        .select('id')
        .eq('mentor_id', user.id);

      if (testsError) {
        throw testsError;
      }

      if (!mentorTests || mentorTests.length === 0) {
        return [];
      }

      // Obter IDs de teste para usar na consulta
      const testIds = mentorTests.map(test => test.id);

      // Buscar client_tests para esses testes
      const { data: clientTests, error: clientTestsError } = await supabase
        .from('client_tests')
        .select(`
          client_id,
          is_completed,
          completed_at
        `)
        .in('test_id', testIds);

      if (clientTestsError) {
        throw clientTestsError;
      }

      if (!clientTests || clientTests.length === 0) {
        return [];
      }

      // Agrupar por client_id para contar testes concluídos
      const clientMap: Record<string, { completedTests: number, lastTestDate?: string }> = {};
      clientTests.forEach(test => {
        if (!clientMap[test.client_id]) {
          clientMap[test.client_id] = { completedTests: 0 };
        }
        
        if (test.is_completed) {
          clientMap[test.client_id].completedTests += 1;
          
          // Atualizar última data de teste se for mais recente
          const testDate = new Date(test.completed_at || '');
          const currentLastDate = clientMap[test.client_id].lastTestDate
            ? new Date(clientMap[test.client_id].lastTestDate)
            : new Date(0);
            
          if (testDate > currentLastDate) {
            clientMap[test.client_id].lastTestDate = test.completed_at;
          }
        }
      });

      // Buscar detalhes dos clientes
      const clientIds = Object.keys(clientMap);
      const { data: clientsData, error: clientsError } = await supabase
        .rpc('get_clients_by_ids', { client_ids: clientIds });

      if (clientsError) {
        throw clientsError;
      }

      if (!clientsData) {
        return [];
      }

      // Formatar dados para o componente
      return clientsData.map((client: any) => ({
        id: client.id,
        name: client.name,
        email: client.email || "Email não disponível",
        company: client.company,
        status: "ativo" as const,
        lastTest: clientMap[client.id].lastTestDate
          ? new Date(clientMap[client.id].lastTestDate).toLocaleDateString('pt-BR')
          : undefined,
        completedTests: clientMap[client.id].completedTests
      }));
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Erro ao carregar lista de clientes");
      return [];
    }
  };

  // Usar React Query para gerenciar estado e cache
  const { data: clients = [], isLoading: isQueryLoading, refetch } = useQuery({
    queryKey: ['clients', user?.id],
    queryFn: fetchClients,
    enabled: !!user
  });

  // Filtrar resultados com base na pesquisa
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRefresh = async () => {
    setIsLoading(true);
    await refetch();
    setIsLoading(false);
    toast.success("Lista de clientes atualizada");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading || isQueryLoading}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading || isQueryLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {filteredClients.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Testes</TableHead>
                <TableHead>Último Teste</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${client.id}`} alt={client.name} />
                        <AvatarFallback>{client.name.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-xs text-muted-foreground">{client.company || "Sem empresa"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.status === "ativo" ? "default" : client.status === "pendente" ? "outline" : "secondary"}>
                      {client.status === "ativo" ? "Ativo" : client.status === "pendente" ? "Pendente" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.completedTests} concluídos</TableCell>
                  <TableCell>{client.lastTest || "Nenhum teste realizado"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          {isQueryLoading ? (
            <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          ) : (
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-4" />
          )}
          <h3 className="font-medium mb-1">
            {isQueryLoading ? "Carregando clientes..." : "Nenhum cliente encontrado"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {isQueryLoading 
              ? "Aguarde enquanto buscamos seus clientes."
              : searchTerm 
                ? "Nenhum cliente corresponde à sua pesquisa. Tente outros termos."
                : "Você ainda não tem clientes. Use o botão 'Convidar Cliente' para começar."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientsList;
