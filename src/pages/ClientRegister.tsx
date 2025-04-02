
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const ClientRegister = () => {
  const [searchParams] = useSearchParams();
  const mentorId = searchParams.get("mentor");
  const email = searchParams.get("email");
  
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar se temos os parâmetros necessários
    if (!mentorId || !email) {
      toast({
        variant: "destructive",
        title: "Link de convite inválido",
        description: "O link de convite que você está usando é inválido ou expirou."
      });
    }
  }, [mentorId, email, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mentorId || !email) {
      toast({
        variant: "destructive",
        title: "Dados de convite inválidos",
        description: "Não foi possível completar o registro com as informações fornecidas."
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
      // Registrar como cliente e associar ao mentor
      // Em um sistema real, você salvaria a relação cliente-mentor no banco
      await register(email, password, name, "client", company);
      
      toast({
        title: "Registro completo!",
        description: "Sua conta foi criada com sucesso."
      });
      
      // Redirecionar para a área do cliente
      navigate("/client");
    } catch (error) {
      console.error("Erro no registro:", error);
    }
  };

  // Se não temos os parâmetros necessários, mostrar mensagem de erro
  if (!mentorId || !email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-red-600">Link Inválido</CardTitle>
            <CardDescription className="text-center">
              O link de convite que você está usando é inválido ou expirou.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link to="/client/login">
              <Button>Ir para o Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Complete seu Registro</CardTitle>
          <CardDescription className="text-center">
            Você foi convidado para criar uma conta como cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email || ""}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">Email fornecido pelo seu mentor</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Digite seu nome completo"
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
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Crie uma senha"
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
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Completar Registro"}
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
