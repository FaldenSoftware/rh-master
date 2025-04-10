
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, Check, ArrowRight, Download, Clock, AlertCircle, Loader2 } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const LeaderSubscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  
  useEffect(() => {
    // Simular carregamento de dados
    const loadSubscriptionData = async () => {
      setLoading(true);
      
      try {
        // Em um ambiente real, aqui você buscaria os dados de assinatura do banco de dados
        // Exemplo: const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
        
        // Simular um tempo de carregamento
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Para fins de demonstração, não carregamos dados falsos
        setHasSubscription(false);
        setSubscriptionData(null);
      } catch (error) {
        console.error("Erro ao carregar dados de assinatura:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);
  
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
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Carregando informações da assinatura...</span>
                </div>
              ) : hasSubscription ? (
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Ciclo de Faturamento</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold">{subscriptionData?.cycle || 'Mensal'}</p>
                        <p className="text-sm text-muted-foreground">Próxima cobrança em {subscriptionData?.nextBillingDate || '15/07/2024'}</p>
                      </div>
                      <Button variant="outline">Alterar Ciclo</Button>
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
                          <p className="text-sm text-muted-foreground">**** **** **** {subscriptionData?.lastFourDigits || '0000'}</p>
                        </div>
                      </div>
                      <Button variant="outline">Atualizar</Button>
                    </div>
                  </div>
                  
                  {subscriptionData?.payments && subscriptionData.payments.length > 0 ? (
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Histórico de Pagamentos</h3>
                      <div className="space-y-3">
                        {subscriptionData.payments.map((payment: any, index: number) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <p className="font-medium">{payment.date}</p>
                              <p className="text-sm text-muted-foreground">{payment.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="font-semibold">{payment.amount}</p>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <CreditCard className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">Nenhum plano ativo</h3>
                  <p className="text-muted-foreground max-w-md">
                    Você está utilizando a versão gratuita da plataforma. Para acessar recursos avançados, 
                    considere adquirir um de nossos planos premium.
                  </p>
                  <Button className="mt-6">Ver planos disponíveis</Button>
                </div>
              )}
            </CardContent>
            {hasSubscription && (
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Cancelar Assinatura
                </Button>
                <Button>
                  Gerenciar Plano
                </Button>
              </CardFooter>
            )}
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
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <h3 className="text-3xl font-bold">Gratuito</h3>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <span className="text-2xl font-bold">R$0</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Até 5 colaboradores</p>
                        <p className="text-sm text-muted-foreground">Ideal para pequenas equipes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Testes básicos</p>
                        <p className="text-sm text-muted-foreground">Avaliações comportamentais simples</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Relatórios básicos</p>
                        <p className="text-sm text-muted-foreground">Resultados individuais</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Suporte por email</p>
                        <p className="text-sm text-muted-foreground">Resposta em até 48 horas</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" variant="outline">
                Ver Planos Premium <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>Recursos limitados no plano gratuito</span>
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-6 rounded-lg border p-4 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Conheça os recursos premium</h4>
                <p className="text-sm text-blue-700 mt-1">Desbloqueie recursos avançados como relatórios comparativos, testes personalizados e suporte prioritário.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LeaderLayout>
  );
};

export default LeaderSubscription;
