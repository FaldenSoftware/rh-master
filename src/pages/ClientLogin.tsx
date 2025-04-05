
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { login, isLoading, error, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === "mentor") {
        navigate("/leader");
      } else {
        navigate("/client");
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Limpa os erros específicos do campo quando o usuário começa a digitar
  useEffect(() => {
    if (formErrors.email) setFormErrors(prev => ({ ...prev, email: "" }));
  }, [email]);

  useEffect(() => {
    if (formErrors.password) setFormErrors(prev => ({ ...prev, password: "" }));
  }, [password]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!email) {
      errors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email inválido";
      isValid = false;
    }

    if (!password) {
      errors.password = "Senha é obrigatória";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Campos inválidos",
        description: "Por favor, corrija os erros no formulário",
      });
      return;
    }
    
    try {
      console.log("Tentando fazer login com:", { email });
      await login(email, password);
    } catch (error) {
      // O erro já é tratado no contexto de autenticação
      console.error("Erro no login (capturado em ClientLogin):", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldErrorClass = (field: string) => {
    return formErrors[field] ? "border-red-500" : "";
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                className={getFieldErrorClass("email")}
              />
              {formErrors.email && (
                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
              )}
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
                className={getFieldErrorClass("password")}
              />
              {formErrors.password && (
                <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
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
