
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, Check, ArrowRight, Download, Clock, AlertCircle } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";

const LeaderSubscription = () => {
  return (
    <LeaderLayout title="Assinatura">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                    Detalhes da Assinatura
                  </CardTitle>
                  <CardDescription>
                    Gerencie os detalhes do seu plano atual
                  </CardDescription>
                </div>
                <Badge className="w-fit bg-gradient-to-r from-blue-600 to-indigo-600">Plano Profissional</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Ciclo de Faturamento</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Mensal</p>
                    <p className="text-sm text-muted-foreground">Próxima cobrança em 15/07/2024</p>
                  </div>
                  <Button variant="outline">Alterar para Anual</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Método de Pagamento</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-14 items-center justify-center rounded-md border bg-white p-1">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Cartão de Crédito</p>
                      <p className="text-sm text-muted-foreground">**** **** **** 4589</p>
                    </div>
                  </div>
                  <Button variant="outline">Atualizar</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Histórico de Pagamentos</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">15/06/2024</p>
                      <p className="text-sm text-muted-foreground">Plano Profissional - Mensal</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">R$249,00</p>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">15/05/2024</p>
                      <p className="text-sm text-muted-foreground">Plano Profissional - Mensal</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">R$249,00</p>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium">15/04/2024</p>
                      <p className="text-sm text-muted-foreground">Plano Profissional - Mensal</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">R$249,00</p>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Cancelar Assinatura
              </Button>
              <Button>
                Gerenciar Plano
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Seu Plano Atual</CardTitle>
              <CardDescription>
                Detalhes do seu plano e uso atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-3xl font-bold">Profissional</h3>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-2xl font-bold">R$249</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Até 50 colaboradores</p>
                    <p className="text-sm text-muted-foreground">12 ativos atualmente</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Todos os tipos de teste</p>
                    <p className="text-sm text-muted-foreground">Comportamental, habilidades e aptidão</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Relatórios avançados</p>
                    <p className="text-sm text-muted-foreground">Comparativos e análises detalhadas</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Suporte prioritário</p>
                    <p className="text-sm text-muted-foreground">Resposta em até 24 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" variant="outline">
                Ver Outros Planos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Renovação em 15/07/2024</span>
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-6 rounded-lg border p-4 bg-yellow-50 border-yellow-200">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Sua assinatura está expirado em breve</h4>
                <p className="text-sm text-yellow-700 mt-1">Sua assinatura será renovada automaticamente em 15/07/2024. Verifique se os dados de pagamento estão atualizados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LeaderLayout>
  );
};

export default LeaderSubscription;
