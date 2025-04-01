
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Clock, Users } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";

const ClientDashboard = () => {
  return (
    <ClientLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testes Realizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testes Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              -4% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +6 novos este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Próximas Avaliações</CardTitle>
            <CardDescription>
              Testes programados para os próximos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Avaliação de Desempenho</p>
                  <p className="text-xs text-muted-foreground">Departamento de Vendas</p>
                </div>
                <div className="text-sm text-muted-foreground">Amanhã</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Teste de Perfil Comportamental</p>
                  <p className="text-xs text-muted-foreground">Novos Colaboradores</p>
                </div>
                <div className="text-sm text-muted-foreground">Em 3 dias</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Avaliação de Competências</p>
                  <p className="text-xs text-muted-foreground">Equipe de TI</p>
                </div>
                <div className="text-sm text-muted-foreground">Em 5 dias</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Status da Assinatura</CardTitle>
            <CardDescription>
              Informações sobre seu plano atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Plano Empresarial</p>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">150/200 testes utilizados este mês</p>
              </div>
              <div>
                <p className="text-sm font-medium">Detalhes do Plano</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Até 200 testes mensais</li>
                  <li>• Relatórios avançados</li>
                  <li>• Análise comparativa</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Renovação em 15 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert className="mt-4 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-600">Novidades</AlertTitle>
        <AlertDescription>
          Nova funcionalidade de relatórios comparativos disponível! Compare o desempenho entre departamentos e equipes.
          <Button variant="link" className="p-0 h-auto text-blue-600 ml-2">
            Saiba mais
          </Button>
        </AlertDescription>
      </Alert>
    </ClientLayout>
  );
};

export default ClientDashboard;
