
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ClientsList from "@/components/leader/ClientsList";
import ClientInviteForm from "@/components/leader/ClientInviteForm";
import LeaderLayout from "@/components/leader/LeaderLayout";

const LeaderClients = () => {
  const [showInviteForm, setShowInviteForm] = useState(false);

  return (
    <LeaderLayout title="Clientes">
      <div className="flex justify-end mb-6">
        <Button 
          onClick={() => setShowInviteForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Convidar Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Clientes</CardTitle>
          <CardDescription>
            Gerencie todos os seus clientes e envie convites para novos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showInviteForm ? (
            <ClientInviteForm onCancel={() => setShowInviteForm(false)} />
          ) : (
            <ClientsList />
          )}
        </CardContent>
      </Card>
    </LeaderLayout>
  );
};

export default LeaderClients;
