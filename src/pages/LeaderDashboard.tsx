
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderLayout from "@/components/leader/LeaderLayout";
import ClientsList from "@/components/leader/ClientsList";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useToast } from "@/components/ui/use-toast";

// Dados de exemplo
const testData = [
  { name: 'Janeiro', completos: 4, pendentes: 2 },
  { name: 'Fevereiro', completos: 6, pendentes: 1 },
  { name: 'Março', completos: 8, pendentes: 3 },
  { name: 'Abril', completos: 5, pendentes: 4 },
  { name: 'Maio', completos: 9, pendentes: 2 },
  { name: 'Junho', completos: 7, pendentes: 1 },
];

const resultadosData = [
  { name: 'Foco', valor: 75 },
  { name: 'Paciência', valor: 60 },
  { name: 'Comunicação', valor: 85 },
  { name: 'Liderança', valor: 70 },
  { name: 'Trabalho em Equipe', valor: 90 },
  { name: 'Resolução de Problemas', valor: 80 },
];

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

const LeaderDashboard = () => {
  const { toast } = useToast();
  
  const handleEditClient = (client: Client) => {
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
    <LeaderLayout title="Dashboard do Mentor">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard do Mentor</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Testes Aplicados</CardTitle>
              <CardDescription>Visão geral dos testes aplicados nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={testData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completos" fill="#8884d8" name="Testes Completos" />
                  <Bar dataKey="pendentes" fill="#82ca9d" name="Testes Pendentes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resultados Médios</CardTitle>
              <CardDescription>Médias de resultados por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={resultadosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="valor" stroke="#8884d8" activeDot={{ r: 8 }} name="Valor" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
            <CardDescription>
              Seus clientes mais recentes e suas informações básicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientsList onEdit={handleEditClient} onDelete={handleDeleteClient} />
          </CardContent>
        </Card>
      </div>
    </LeaderLayout>
  );
};

export default LeaderDashboard;
