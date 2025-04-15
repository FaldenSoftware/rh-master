
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Camera, Settings, User, Mail, Lock, Trash2, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/client/ClientLayout";

interface ProfileFormValues {
  name: string;
  phone: string;
  position: string;
  bio: string;
}

const ClientAccount = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      position: user?.position || "",
      bio: user?.bio || ""
    }
  });
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsUpdating(true);
      
      await updateProfile({
        name: data.name,
        phone: data.phone,
        position: data.position,
        bio: data.bio
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Seus dados foram atualizados com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar seu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;
      
      setIsUploadingImage(true);
      
      // For dev mode, just set the avatar URL to a data URL
      if (localStorage.getItem('devModeActive') === 'true') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;
          setAvatarUrl(dataUrl);
          await updateProfile({ avatar_url: dataUrl });
          
          toast({
            title: "Foto atualizada",
            description: "Sua foto de perfil foi atualizada com sucesso.",
          });
          setIsUploadingImage(false);
        };
        reader.readAsDataURL(file);
        return;
      }
      
      // Regular upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;
      
      // Check if storage bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('avatars');
      
      // If bucket doesn't exist, create it
      if (bucketError && bucketError.message.includes('does not exist')) {
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
        });
      }
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile
      await updateProfile({ avatar_url: publicUrl });
      setAvatarUrl(publicUrl);
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      toast({
        title: "Erro ao atualizar foto",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar sua foto de perfil.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ClientLayout title="Minha Conta">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Informações Pessoais
          </TabsTrigger>
          <TabsTrigger value="account">
            <Settings className="h-4 w-4 mr-2" />
            Conta
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sua Foto</CardTitle>
                <CardDescription>
                  Esta foto será exibida no seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative mb-6">
                  <Avatar className="w-32 h-32 border-4 border-background">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="text-2xl bg-purple-100 text-purple-700">
                      {user?.name ? getInitials(user.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute bottom-0 right-0">
                    <Label 
                      htmlFor="avatar-upload" 
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      {isUploadingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                    </Label>
                    <Input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="sr-only" 
                      onChange={handleAvatarChange}
                      disabled={isUploadingImage}
                    />
                  </div>
                </div>
                
                <div className="text-center space-y-1.5">
                  <h3 className="font-medium text-base">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize seus dados pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        placeholder="Seu nome completo" 
                        {...register("name", { required: "Nome é obrigatório" })}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                        <div className="bg-muted px-3 py-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                        </div>
                        <Input 
                          id="phone" 
                          placeholder="Seu telefone" 
                          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" 
                          {...register("phone")}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo</Label>
                    <Input 
                      id="position" 
                      placeholder="Seu cargo atual" 
                      {...register("position")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Conte um pouco sobre você..." 
                      className="min-h-[120px]" 
                      {...register("bio")}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-blue-500" />
                  E-mail
                </CardTitle>
                <CardDescription>
                  Gerenciar seu endereço de e-mail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Seu e-mail atual</Label>
                  <div className="flex items-center border rounded-md p-2 bg-gray-50">
                    <p className="flex-1 text-sm font-medium">{user?.email}</p>
                    <Badge className="ml-2">Verificado</Badge>
                  </div>
                </div>
                
                <Button variant="outline">Alterar E-mail</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-amber-500" />
                  Senha
                </CardTitle>
                <CardDescription>
                  Altere sua senha regularmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input type="password" id="current-password" placeholder="Digite sua senha atual" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input type="password" id="new-password" placeholder="Digite sua nova senha" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input type="password" id="confirm-password" placeholder="Confirme sua nova senha" />
                  </div>
                  
                  <Button>Atualizar Senha</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="text-red-600">
                <CardTitle className="flex items-center">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Excluir Conta
                </CardTitle>
                <CardDescription>
                  Excluir permanentemente sua conta e todos os seus dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
                  </p>
                  <Button variant="destructive">Excluir minha conta</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </ClientLayout>
  );
};

export default ClientAccount;
