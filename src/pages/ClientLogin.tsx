
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createTestUsers } from "@/lib/auth";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingTestUsers, setIsCreatingTestUsers] = useState(false);
  const { login, isLoading, error } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      // Erro já é tratado no contexto de autenticação
      console.error("Erro no login:", error);
    }
  };

  const handleCreateTestUsers = async () => {
    setIsCreatingTestUsers(true);
    try {
      await createTestUsers();
      toast({
        title: "Usuários de teste criados com sucesso",
        description: "Email: admin@example.com / Senha: admin1234 (mentor)\nEmail: cliente@example.com / Senha: teste1234 (cliente)",
        duration: 10000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuários de teste",
        description: error.message,
      });
    } finally {
      setIsCreatingTestUsers(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Digite seu email"
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
            
            {error && (
              <div className="text-sm text-red-500 font-medium">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleCreateTestUsers}
              disabled={isCreatingTestUsers}
            >
              {isCreatingTestUsers ? "Criando usuários..." : "Criar usuários de teste"}
            </Button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Cria contas de admin e cliente para teste
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Registre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientLogin;
