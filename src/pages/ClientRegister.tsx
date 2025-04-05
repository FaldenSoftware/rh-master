import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { verifyInvitationCode, isValidCodeFormat } from "@/lib/invitationCode";
import { InvitationCode } from "@/types/models";
import { AuthUser } from "@/lib/auth";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
  inviteCode: z.string().min(12, {
    message: "Código de convite é obrigatório e deve ter 12 caracteres.",
  }).refine(isValidCodeFormat, {
    message: "Código de convite inválido. Deve ter 12 caracteres e incluir letras e números/caracteres especiais."
  })
});

export default function ClientRegister() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);
  const [inviteData, setInviteData] = useState<InvitationCode | null>(null);
  const { register } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: searchParams.get("email") || "",
      password: "",
      inviteCode: searchParams.get("code") || "",
    },
  });

  const watchInviteCode = form.watch("inviteCode");

  useEffect(() => {
    const verifyCode = async () => {
      if (watchInviteCode && watchInviteCode.length === 12) {
        setIsVerifying(true);
        setIsCodeValid(null);
        
        const result = await verifyInvitationCode(watchInviteCode, supabase);
        
        setIsCodeValid(result.valid);
        if (result.valid && result.data) {
          setInviteData(result.data as InvitationCode);
          if (result.data.email && !form.getValues("email")) {
            form.setValue("email", result.data.email);
          }
        } else {
          setInviteData(null);
        }
        
        setIsVerifying(false);
      } else {
        setIsCodeValid(null);
        setInviteData(null);
      }
    };
    
    const timeoutId = setTimeout(verifyCode, 500);
    return () => clearTimeout(timeoutId);
  }, [watchInviteCode, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      if (!isCodeValid) {
        toast({
          variant: "destructive",
          title: "Código inválido",
          description: "O código de convite é inválido ou expirou.",
        });
        setIsLoading(false);
        return;
      }
      
      const mentorId = inviteData?.mentor_id;
      if (!mentorId) {
        throw new Error("Mentor ID não encontrado no código de convite");
      }
      
      const result: AuthUser | null = await register(values.email, values.password, values.name, "client", undefined);
      
      if (result !== null) {
        const { error } = await supabase
          .from('invitation_codes')
          .update({ 
            is_used: true,
            used_by: result.id
          } as any)
          .eq('code', values.inviteCode);
        
        if (error) {
          console.error("Erro ao atualizar código de convite:", error);
        }
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ mentor_id: mentorId } as any)
          .eq('id', result.id);
          
        if (profileError) {
          console.error("Erro ao vincular cliente ao mentor:", profileError);
        }
      }
      
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo! Sua conta foi criada com sucesso.",
      });
      
      navigate("/client/login");
    } catch (error) {
      console.error("Erro no registro:", error);
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: error instanceof Error ? error.message : "Ocorreu um erro durante o registro.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Criar conta</CardTitle>
            <CardDescription className="text-center">
              Preencha os campos abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Código de convite <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="Digite o código de 12 dígitos" 
                            {...field} 
                            className={`font-mono ${
                              isCodeValid === true ? 'border-green-500 pr-10' : 
                              isCodeValid === false ? 'border-red-500 pr-10' : ''
                            }`}
                          />
                        </FormControl>
                        {isVerifying && (
                          <div className="absolute right-3 top-3">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        {isCodeValid === true && !isVerifying && (
                          <div className="absolute right-3 top-3">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                        {isCodeValid === false && !isVerifying && (
                          <div className="absolute right-3 top-3">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading || isVerifying || isCodeValid === false}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/client/login" className="text-primary underline">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
