
import React, { useState, useEffect } from "react";
import { checkEmailConfig } from "@/services/emailConfigService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsList from "@/components/leader/ClientsList";
import ClientInviteForm from "@/components/leader/ClientInviteForm";
import InvitationHistory from "@/components/leader/InvitationHistory";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

const LeaderClients = () => {
  // Verificação de configuração SMTP
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);

  const { toast } = useToast();
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    const checkConfig = async () => {
      setIsCheckingConfig(true);
      try {
        const result = await checkEmailConfig();
        setIsConfigured(result.configured);
      } catch (error) {
        console.error("Erro ao verificar configuração:", error);
        setIsConfigured(false);
      } finally {
        setIsCheckingConfig(false);
      }
    };
    checkConfig();
  }, []);
  const { toast } = useToast();
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  
  // Verificar se há um parâmetro de URL para definir a aba ativa
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam === 'invite') {
      setActiveTab('invite');
    }
  }, [location]);

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

  const handleCancelInvite = () => {
    // Switch back to list tab when cancel is clicked
    setActiveTab("list");
  };

  return (
    <LeaderLayout title="Gestão de Clientes">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Gestão de Clientes</h1>

        {/* Alerta de configuração SMTP */}
        {!isCheckingConfig && isConfigured === false && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Configuração Incompleta</AlertTitle>
            <AlertDescription>
              O sistema de email não está configurado. Contate o administrador para configurar as variáveis SMTP_USERNAME e SMTP_PASSWORD no Supabase.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="list">Lista de Clientes</TabsTrigger>
            <TabsTrigger value="invite">Convidar Cliente</TabsTrigger>
            <TabsTrigger value="history">Histórico de Convites</TabsTrigger>
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
                <ClientInviteForm onCancel={handleCancelInvite} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Convites</CardTitle>
                <CardDescription>
                  Visualize todos os convites enviados e seu status atual.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InvitationHistory />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LeaderLayout>
  );
};

export default LeaderClients;
