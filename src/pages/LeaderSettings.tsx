import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save, User, Building2, Shield } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/userProfile";
import { addSamyllaClient } from "@/lib/addSamyllaClient";
import { supabase } from "@/integrations/supabase/client";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().optional(),
  position: z.string().optional(),
  bio: z.string().optional(),
});

const companyFormSchema = z.object({
  company: z.string().min(2, {
    message: "Nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  cnpj: z.string().optional(),
  industry: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  website: z.string().url({
    message: "URL inválida. Inclua http:// ou https://",
  }).optional().or(z.literal("")),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Senha atual é obrigatória.",
  }),
  newPassword: z.string().min(6, {
    message: "Nova senha deve ter pelo menos 6 caracteres.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Confirmação da senha deve ter pelo menos 6 caracteres.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

const LeaderSettings = () => {
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingCompany, setIsSubmittingCompany] = useState(false);
  const [isSubmittingSecurity, setIsSubmittingSecurity] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);
  
  const { user, isLoading } = useAuth();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      bio: "",
    },
  });

  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      company: "",
      cnpj: "",
      industry: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      website: "",
    },
  });

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user && !isLoading) {
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        position: user.position || "",
        bio: user.bio || "",
      });

      companyForm.reset({
        company: user.company || "",
        cnpj: (user as any).cnpj || "",
        industry: (user as any).industry || "",
        address: (user as any).address || "",
        city: (user as any).city || "",
        state: (user as any).state || "",
        zipCode: (user as any).zipCode || "",
        website: (user as any).website || "",
      });
    }
  }, [user, isLoading, profileForm, companyForm]);

  const onSubmitProfile = async (data: z.infer<typeof profileFormSchema>) => {
    setIsSubmittingProfile(true);

    try {
      const updated = await updateUserProfile({
        name: data.name,
        phone: data.phone,
        position: data.position,
        bio: data.bio
      });
      
      if (updated) {
        toast.success("Perfil atualizado com sucesso");
      } else {
        toast.error("Erro ao atualizar perfil");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const onSubmitCompany = async (data: z.infer<typeof companyFormSchema>) => {
    setIsSubmittingCompany(true);

    try {
      const updated = await updateUserProfile({
        company: data.company,
        cnpj: data.cnpj,
        industry: data.industry,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        website: data.website || null
      });
      
      if (updated) {
        toast.success("Dados da empresa atualizados com sucesso");
      } else {
        toast.error("Erro ao atualizar dados da empresa");
      }
    } catch (error) {
      console.error("Erro ao atualizar dados da empresa:", error);
      toast.error("Erro ao atualizar dados da empresa");
    } finally {
      setIsSubmittingCompany(false);
    }
  };

  const onSubmitSecurity = async (data: z.infer<typeof securityFormSchema>) => {
    setIsSubmittingSecurity(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) {
        throw error;
      }
      
      securityForm.reset();
      toast.success("Senha atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      toast.error("Erro ao atualizar senha. Verifique se a senha atual está correta.");
    } finally {
      setIsSubmittingSecurity(false);
    }
  };

  const handleAddSamyllaClient = async () => {
    setIsAddingClient(true);
    
    try {
      if (!user || !user.id) {
        toast.error("Usuário não autenticado");
        return;
      }
      
      const result = await addSamyllaClient(
        "samylla@example.com", 
        "Samylla", 
        user.id
      );
      
      if (result.success) {
        toast.success("Cliente Samylla adicionada com sucesso!");
      } else {
        toast.error(`Falha ao adicionar cliente: ${result.error}`);
      }
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast.error("Erro ao adicionar cliente");
    } finally {
      setIsAddingClient(false);
    }
  };

  if (isLoading) {
    return (
      <LeaderLayout title="Configurações">
        <div className="container py-6 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Carregando configurações...</p>
          </div>
        </div>
      </LeaderLayout>
    );
  }

  return (
    <LeaderLayout title="Configurações">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Perfil Pessoal</TabsTrigger>
            <TabsTrigger value="company">Dados da Empresa</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle>Perfil Pessoal</CardTitle>
                </div>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="seu@email.com"
                                {...field}
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Seu telefone"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Seu cargo"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biografia</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Conte um pouco sobre você"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="submit"
                        disabled={isSubmittingProfile}
                      >
                        {isSubmittingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>

                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Ações administrativas</h3>
                  <Button 
                    variant="outline" 
                    onClick={handleAddSamyllaClient}
                    disabled={isAddingClient}
                  >
                    {isAddingClient ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adicionando...
                      </>
                    ) : (
                      "Adicionar Samylla como cliente"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle>Dados da Empresa</CardTitle>
                </div>
                <CardDescription>
                  Atualize as informações da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...companyForm}>
                  <form
                    onSubmit={companyForm.handleSubmit(onSubmitCompany)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={companyForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da empresa</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nome da empresa"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="cnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CNPJ</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="CNPJ da empresa"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Setor/Indústria</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: Tecnologia"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.empresa.com.br"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={companyForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Endereço da empresa"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Cidade"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Estado"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="CEP"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="submit"
                        disabled={isSubmittingCompany}
                      >
                        {isSubmittingCompany ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Segurança</CardTitle>
                </div>
                <CardDescription>
                  Atualize sua senha e configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form
                    onSubmit={securityForm.handleSubmit(onSubmitSecurity)}
                    className="space-y-4"
                  >
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha atual</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite sua senha atual"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={securityForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova senha</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite a nova senha"
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirme a nova senha</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite a nova senha novamente"
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="submit"
                        disabled={isSubmittingSecurity}
                      >
                        {isSubmittingSecurity ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Atualizando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Atualizar senha
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LeaderLayout>
  );
};

export default LeaderSettings;
