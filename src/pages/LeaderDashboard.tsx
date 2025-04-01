
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, LineChart, Calendar } from "lucide-react";
import ClientsList from "@/components/leader/ClientsList";
import ClientInviteForm from "@/components/leader/ClientInviteForm";
import LeaderLayout from "@/components/leader/LeaderLayout";

const LeaderDashboard = () => {
  const [showInviteForm, setShowInviteForm] = useState(false);

  return (
    <LeaderLayout title="Dashboard">
      <div className="flex justify-end mb-6">
        <Button 
          onClick={() => setShowInviteForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Convidar Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">12</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Testes Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <LineChart className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">48</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Próxima Renovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-purple-500 mr-2" />
              <div className="text-2xl font-bold">15/Jul/2024</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
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
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
              <CardDescription>
                Visualize todos os resultados dos testes comportamentais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Aqui você verá os relatórios e resultados de todos os testes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rankings">
          <Card>
            <CardHeader>
              <CardTitle>Rankings & Gamificação</CardTitle>
              <CardDescription>
                Acompanhe o desempenho comparativo entre colaboradores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Aqui você verá o ranking dos participantes com melhor desempenho.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Minha Assinatura</CardTitle>
              <CardDescription>
                Gerencie os detalhes da sua assinatura e faturamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <h3 className="font-medium">Plano Atual</h3>
                    <p className="text-sm text-muted-foreground">Plano Profissional</p>
                  </div>
                  <Button variant="outline">Alterar Plano</Button>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <h3 className="font-medium">Ciclo de Faturamento</h3>
                    <p className="text-sm text-muted-foreground">Mensal</p>
                  </div>
                  <Button variant="outline">Alterar para Anual</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Próxima Cobrança</h3>
                    <p className="text-sm text-muted-foreground">15/07/2024 - R$ 249,00</p>
                  </div>
                  <Button variant="outline" className="text-red-500 hover:text-red-600">
                    Cancelar Assinatura
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </LeaderLayout>
  );
};

export default LeaderDashboard;
