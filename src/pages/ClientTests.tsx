
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import ClientLayout from "@/components/client/ClientLayout";

const testData = [
  { id: "T-1001", name: "Avaliação de Desempenho", department: "Vendas", assigned: 12, completed: 8, status: "Em Andamento" },
  { id: "T-1002", name: "Perfil Comportamental", department: "Recursos Humanos", assigned: 5, completed: 5, status: "Concluído" },
  { id: "T-1003", name: "Análise de Competências", department: "TI", assigned: 8, completed: 2, status: "Em Andamento" },
  { id: "T-1004", name: "Pesquisa de Clima", department: "Todos", assigned: 45, completed: 30, status: "Em Andamento" },
  { id: "T-1005", name: "Avaliação 360", department: "Diretoria", assigned: 6, completed: 0, status: "Não Iniciado" },
];

const ClientTests = () => {
  return (
    <ClientLayout title="Testes">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar testes..."
              className="w-full pl-8 md:w-[300px]"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Teste
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Em Andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Testes</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os testes da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Atribuídos</TableHead>
                    <TableHead>Concluídos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testData.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>{test.department}</TableCell>
                      <TableCell>{test.assigned}</TableCell>
                      <TableCell>{test.completed}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            test.status === "Concluído" ? "border-green-200 text-green-800 bg-green-50" :
                            test.status === "Em Andamento" ? "border-amber-200 text-amber-800 bg-amber-50" :
                            "border-gray-200 text-gray-800 bg-gray-50"
                          }
                        >
                          {test.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Testes em Andamento</CardTitle>
              <CardDescription>
                Testes que estão sendo realizados no momento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Atribuídos</TableHead>
                    <TableHead>Concluídos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testData.filter(test => test.status === "Em Andamento").map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>{test.department}</TableCell>
                      <TableCell>{test.assigned}</TableCell>
                      <TableCell>{test.completed}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          {/* Similar structure to "active" tab with filtered data */}
          <Card>
            <CardHeader>
              <CardTitle>Testes Concluídos</CardTitle>
              <CardDescription>
                Testes que já foram finalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Atribuídos</TableHead>
                    <TableHead>Concluídos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testData.filter(test => test.status === "Concluído").map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>{test.department}</TableCell>
                      <TableCell>{test.assigned}</TableCell>
                      <TableCell>{test.completed}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Ver Relatório</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Testes Agendados</CardTitle>
              <CardDescription>
                Testes que serão aplicados no futuro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Atribuídos</TableHead>
                    <TableHead>Data Programada</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testData.filter(test => test.status === "Não Iniciado").map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>{test.department}</TableCell>
                      <TableCell>{test.assigned}</TableCell>
                      <TableCell>15/07/2023</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ClientLayout>
  );
};

export default ClientTests;
