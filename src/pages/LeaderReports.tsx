
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileText, Calendar, Filter, Search, FileSpreadsheet, File, Loader2 } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { useAuth } from "@/context/AuthContext";

// Interface para os relatórios
interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
}

const LeaderReports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasReports, setHasReports] = useState(false);
  
  useEffect(() => {
    // Simular carregamento de dados
    const loadReports = async () => {
      setLoading(true);
      
      try {
        // Em um ambiente real, aqui você buscaria os relatórios do banco de dados
        // Exemplo: const { data } = await supabase.from('reports').select('*').eq('mentor_id', user.id);
        
        // Simular um tempo de carregamento
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Para fins de demonstração, não carregamos dados falsos
        // Se o usuário tiver relatórios reais no futuro, eles seriam carregados aqui
        setReports([]);
        setHasReports(false);
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadReports();
    }
  }, [user]);
  
  return (
    <LeaderLayout title="Relatórios">
      <div className="container mx-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos os Relatórios</TabsTrigger>
            <TabsTrigger value="individual">Relatórios Individuais</TabsTrigger>
            <TabsTrigger value="team">Relatórios de Equipe</TabsTrigger>
            <TabsTrigger value="custom">Relatórios Personalizados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-500" />
                    Todos os Relatórios
                  </CardTitle>
                  <CardDescription>
                    Visualize e baixe todos os relatórios gerados
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Período
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Carregando relatórios...</span>
                </div>
              ) : hasReports ? (
                <>
                  <div className="mb-4 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar relatórios..." className="pl-8" />
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nome do Relatório</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.id}</TableCell>
                            <TableCell>{report.name}</TableCell>
                            <TableCell>{report.type}</TableCell>
                            <TableCell>{report.date}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                {report.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" title="Baixar como PDF">
                                  <File className="h-4 w-4 text-red-500" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Baixar como Excel">
                                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">Nenhum relatório disponível</h3>
                  <p className="text-muted-foreground max-w-md">
                    Você ainda não possui relatórios gerados. À medida que seus clientes realizarem testes, 
                    os relatórios serão disponibilizados aqui automaticamente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
          <TabsContent value="individual">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Individuais</CardTitle>
                <CardDescription>
                  Relatórios detalhados por colaborador
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Selecione um colaborador</h3>
                  <p className="max-w-md mx-auto">
                    Para gerar um relatório individual, selecione um colaborador da sua lista de clientes.
                  </p>
                  <Button className="mt-4">
                    Selecionar Colaborador
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Equipe</CardTitle>
                <CardDescription>
                  Relatórios agregados por equipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Selecione uma equipe</h3>
                  <p className="max-w-md mx-auto">
                    Para gerar um relatório de equipe, selecione uma equipe da sua organização.
                  </p>
                  <Button className="mt-4">
                    Selecionar Equipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Personalizados</CardTitle>
                <CardDescription>
                  Crie relatórios sob medida com os dados que você precisa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Crie um relatório personalizado</h3>
                  <p className="max-w-md mx-auto">
                    Escolha métricas específicas e parâmetros para criar um relatório personalizado.
                  </p>
                  <Button className="mt-4">
                    Criar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LeaderLayout>
  );
};

export default LeaderReports;
