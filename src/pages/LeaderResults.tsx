
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart as LineChartIcon, PieChart } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

// Sample data for the charts
const monthlyData = [
  { name: "Jan", tests: 4 },
  { name: "Fev", tests: 6 },
  { name: "Mar", tests: 8 },
  { name: "Abr", tests: 10 },
  { name: "Mai", tests: 7 },
  { name: "Jun", tests: 12 },
];

const profileData = [
  { name: "Analista", value: 25 },
  { name: "Executor", value: 40 },
  { name: "Comunicador", value: 20 },
  { name: "Planejador", value: 15 },
];

const testTypeData = [
  { name: "Comportamental", tests: 35 },
  { name: "Habilidades", tests: 28 },
  { name: "Conhecimento", tests: 16 },
  { name: "Aptidão", tests: 21 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const LeaderResults = () => {
  return (
    <LeaderLayout title="Resultados">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="profiles">Perfis</TabsTrigger>
          <TabsTrigger value="compare">Comparativos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChartIcon className="mr-2 h-5 w-5 text-blue-500" />
                  Testes Realizados por Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="tests" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Testes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-purple-500" />
                  Distribuição de Perfis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={profileData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {profileData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="profiles">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Perfis</CardTitle>
              <CardDescription>
                Distribuição detalhada dos perfis comportamentais dos colaboradores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={profileData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Quantidade" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo por Tipo de Teste</CardTitle>
              <CardDescription>
                Comparação da quantidade de testes por categoria.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={testTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tests" fill="#82ca9d" name="Testes" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </LeaderLayout>
  );
};

export default LeaderResults;
