
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Building, Bell, Shield, Key, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const LeaderSettings = () => {
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    bio: "",
    company: ""
  });
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);
  
  const fetchProfileData = async () => {
    setProfileLoading(true);
    try {
      console.log("Fetching profile data for user:", user?.id);
      
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }
      
      // Fetch user profile from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile data:", profileError);
        
        // Fallback to user object from context if profile query fails
        if (user) {
          console.log("Using user data from auth context:", user);
          
          // Split name into first and last name
          const nameParts = user.name ? user.name.split(' ') : ['', ''];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setProfile({
            firstName,
            lastName,
            email: user.email || '',
            phone: user.phone || '',
            position: user.position || '',
            bio: user.bio || '',
            company: user.company || ''
          });
          setProfileLoading(false);
          return;
        }
        
        toast.error("Erro ao carregar dados do perfil");
        return;
      }
      
      console.log("Profile data loaded:", profileData);
      
      // Split name into first and last name
      const nameParts = profileData.name ? profileData.name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setProfile({
        firstName,
        lastName,
        email: user?.email || '',
        phone: profileData.phone || '',
        position: profileData.position || '',
        bio: profileData.bio || '',
        company: profileData.company || ''
      });
    } catch (error) {
      console.error("Error in fetchProfileData:", error);
      toast.error("Erro ao carregar dados do perfil");
    } finally {
      setProfileLoading(false);
    }
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          phone: profile.phone,
          position: profile.position,
          bio: profile.bio
        })
        .eq('id', user?.id);
      
      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Erro ao atualizar perfil");
        return;
      }
      
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      console.error("Error in handleSaveProfile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company: profile.company
        })
        .eq('id', user?.id);
      
      if (error) {
        console.error("Error updating company:", error);
        toast.error("Erro ao atualizar dados da empresa");
        return;
      }
      
      toast.success("Dados da empresa atualizados com sucesso");
    } catch (error) {
      console.error("Error in handleSaveCompany:", error);
      toast.error("Erro ao atualizar dados da empresa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LeaderLayout title="Configurações">
      {profileLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando dados do perfil...</span>
        </div>
      ) : (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  Perfil do Usuário
                </CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="" alt="Profile" />
                        <AvatarFallback className="text-lg">
                          {profile.firstName && profile.lastName 
                            ? `${profile.firstName[0]}${profile.lastName[0]}`
                            : user?.name?.slice(0, 2) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">Alterar Foto</Button>
                    </div>
                    
                    <div className="grid gap-4 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nome</Label>
                          <Input 
                            id="firstName" 
                            value={profile.firstName} 
                            onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Sobrenome</Label>
                          <Input 
                            id="lastName" 
                            value={profile.lastName}
                            onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile.email} 
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input 
                          id="phone" 
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="position">Cargo</Label>
                        <Input 
                          id="position" 
                          value={profile.position}
                          onChange={(e) => setProfile({...profile, position: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea 
                      id="bio" 
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5 text-blue-500" />
                  Dados da Empresa
                </CardTitle>
                <CardDescription>
                  Atualize as informações da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveCompany} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input 
                        id="companyName" 
                        value={profile.company}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Setor</Label>
                        <Input id="industry" defaultValue="Tecnologia" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input id="address" defaultValue="Av. Paulista, 1000" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" defaultValue="São Paulo" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" defaultValue="SP" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input id="zipCode" defaultValue="01310-100" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue="https://www.empresaxyz.com.br" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-blue-500" />
                  Preferências de Notificação
                </CardTitle>
                <CardDescription>
                  Gerencie como e quando receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Notificações por Email</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email_tests">Novos Testes Completados</Label>
                        <p className="text-sm text-muted-foreground">Receba notificações quando um colaborador completar um teste</p>
                      </div>
                      <Switch id="email_tests" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email_invites">Convites Aceitos</Label>
                        <p className="text-sm text-muted-foreground">Receba notificações quando um convite for aceito</p>
                      </div>
                      <Switch id="email_invites" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email_reports">Relatórios Gerados</Label>
                        <p className="text-sm text-muted-foreground">Receba notificações quando novos relatórios forem gerados</p>
                      </div>
                      <Switch id="email_reports" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email_billing">Faturamento</Label>
                        <p className="text-sm text-muted-foreground">Receba notificações sobre cobranças e faturamento</p>
                      </div>
                      <Switch id="email_billing" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Notificações no Sistema</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="system_tests">Novos Testes Completados</Label>
                        <p className="text-sm text-muted-foreground">Receba notificações no sistema quando um colaborador completar um teste</p>
                      </div>
                      <Switch id="system_tests" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="system_invites">Convites Aceitos</Label>
                        <p className="text-sm text-muted-foreground">Receba notificações no sistema quando um convite for aceito</p>
                      </div>
                      <Switch id="system_invites" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Salvar Preferências</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-500" />
                  Segurança
                </CardTitle>
                <CardDescription>
                  Gerencie sua senha e configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Alteração de Senha</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Senha Atual</Label>
                      <Input id="current_password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new_password">Nova Senha</Label>
                      <Input id="new_password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                      <Input id="confirm_password" type="password" />
                    </div>
                    
                    <div className="pt-2">
                      <Button>Alterar Senha</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Verificação em Duas Etapas</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two_factor">Habilitar Verificação em Duas Etapas</Label>
                        <p className="text-sm text-muted-foreground">Proteja sua conta com um código adicional enviado para seu celular</p>
                      </div>
                      <Switch id="two_factor" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="session_timeout">Encerrar Sessões Inativas</Label>
                        <p className="text-sm text-muted-foreground">Encerre automaticamente sessões após um período de inatividade</p>
                      </div>
                      <Switch id="session_timeout" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <Button variant="destructive">
                      <Key className="mr-2 h-4 w-4" />
                      Encerrar Todas as Sessões Ativas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </LeaderLayout>
  );
};

export default LeaderSettings;
