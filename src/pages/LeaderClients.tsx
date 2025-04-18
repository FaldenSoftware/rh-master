
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InviteClientForm } from "@/components/invitations/InviteClientForm";
import { InvitationHistory } from "@/components/invitations/InvitationHistory";
import { ClientsList } from "@/components/clients/ClientsList";

export default function LeaderClients() {
  const [activeTab, setActiveTab] = useState("clients");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleInviteSent = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab("history");
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Gestão de Clientes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <InviteClientForm onInviteSent={handleInviteSent} />
        </div>
        
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="clients" className="flex-1">
                Lista de Clientes
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                Histórico de Convites
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="clients">
              <ClientsList key={refreshTrigger} />
            </TabsContent>
            
            <TabsContent value="history">
              <InvitationHistory key={refreshTrigger} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
