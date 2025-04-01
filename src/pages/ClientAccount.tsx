
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Phone, Building, Lock, Bell } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";

const ClientAccount = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulação de salvamento
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso",
      });
    }, 1000);
  };

  const handleChangePassword = () => {
    setIsLoading(true);
    
    // Simulação de salvamento
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso",
      });
    }, 1000);
  };

  return (
    <ClientLayout title="Minha Conta">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize seus dados cadastrais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" alt="João Silva" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Alterar foto</Button>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          defaultValue="João Silva"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          defaultValue="joao.silva@empresa.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          defaultValue="(11) 98765-4321"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company"
                          defaultValue="Empresa ABC Ltda"
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar alterações"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-500" />
                Segurança
              </CardTitle>
              <CardDescription>
                Gerencie sua senha e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirme a Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Button onClick={handleChangePassword} disabled={isLoading}>
                  {isLoading ? "Atualizando..." : "Atualizar senha"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure suas preferências de comunicação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba lembretes sobre testes pendentes
                    </p>
                  </div>
                  <Switch id="email-notif" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="results-notif">Alertas de Resultados</Label>
                    <p className="text-sm text-muted-foreground">
                      Seja notificado quando novos resultados estiverem disponíveis
                    </p>
                  </div>
                  <Switch id="results-notif" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="news-notif">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba dicas e conteúdos sobre desenvolvimento pessoal
                    </p>
                  </div>
                  <Switch id="news-notif" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientAccount;
