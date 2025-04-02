
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

const ClientRegister = () => {
  const [searchParams] = useSearchParams();
  const mentorId = searchParams.get("mentor");
  const inviteEmail = searchParams.get("email");
  
  const [email, setEmail] = useState(inviteEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [isValidInvite, setIsValidInvite] = useState(false);
  const [isCheckingInvite, setIsCheckingInvite] = useState(true);
  
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verificar se o convite é válido (mentor existe)
  useEffect(() => {
    const validateInvite = async () => {
      if (!mentorId) {
        setIsValidInvite(false);
        setIsCheckingInvite(false);
        return;
      }

      try {
        // Verificar se o mentor existe usando a função RPC segura
        const { data, error } = await supabase.rpc('get_profile_by_id', { user_id: mentorId });
        
        if (error) {
          throw error;
        }
        
        // Validar que o usuário existe e é um mentor
        setIsValidInvite(!!data && data.length > 0 && data[0].role === 'mentor');
      } catch (error) {
        console.error('Erro ao validar convite:', error);
        setIsValidInvite(false);
      } finally {
        setIsCheckingInvite(false);
      }
    };

    validateInvite();
  }, [mentorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidInvite) {
      toast({
        variant: "destructive",
        title: "Convite inválido",
        description: "Este link de convite não é válido ou expirou. Por favor, solicite um novo convite."
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas digitadas são iguais"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres"
      });
      return;
    }
    
    try {
      // Registrar como cliente e vincular ao mentor que enviou o convite
      await register(email, password, name, "client", company, mentorId);
      
      // Redirecionar para o dashboard do cliente após registro
      toast({
        title: "Registro concluído com sucesso!",
        description: "Bem-vindo à plataforma. Você será redirecionado para o dashboard.",
      });
      
      // Aguardar um pouco para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate("/client");
      }, 1500);
    } catch (error) {
      console.error("Erro no registro:", error);
    }
  };

  // Mostrar indicador de carregamento enquanto verifica o convite
  if (isCheckingInvite) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Verificando Convite</CardTitle>
            <CardDescription>
              Por favor, aguarde enquanto verificamos seu convite.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mostrar mensagem de erro se o convite for inválido
  if (!isValidInvite) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Convite Inválido</CardTitle>
            <CardDescription>
              Este link de convite não é válido ou expirou. Por favor, solicite um novo convite ao seu mentor.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <Link to="/client/login">
              <Button>Ir para o Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Criar Conta de Cliente</CardTitle>
          <CardDescription className="text-center">
            Registre-se para acessar seus testes e avaliações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Digite seu nome"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Digite seu email"
                readOnly={!!inviteEmail}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite sua senha"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme sua senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Digite novamente sua senha"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Digite o nome da sua empresa (opcional)"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Concluir Registro
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Já tem uma conta?{" "}
            <Link to="/client/login" className="text-blue-600 hover:underline">
              Faça login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientRegister;
