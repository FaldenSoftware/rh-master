
import React, { useState } from "react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsList from "@/components/leader/ClientsList";
import ClientInviteForm from "@/components/leader/ClientInviteForm";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

const LeaderClients = () => {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    toast({
      title: "Edição de cliente",
      description: `Editando ${client.name}`,
    });
  };

  const handleDeleteClient = (clientId: string) => {
    toast({
      title: "Cliente excluído",
      description: `O cliente foi excluído com sucesso.`,
    });
  };

  return (
    <LeaderLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Gestão de Clientes</h1>
        
        <Tabs defaultValue="list">
          <TabsList className="mb-6">
            <TabsTrigger value="list">Lista de Clientes</TabsTrigger>
            <TabsTrigger value="invite">Convidar Cliente</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Clientes</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os seus clientes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientsList onEdit={handleEditClient} onDelete={handleDeleteClient} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invite">
            <Card>
              <CardHeader>
                <CardTitle>Convidar Novo Cliente</CardTitle>
                <CardDescription>
                  Envie um convite para um novo cliente se juntar à plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientInviteForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LeaderLayout>
  );
};

export default LeaderClients;
