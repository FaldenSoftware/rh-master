
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ClientLogin = () => {
  // Normal login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Dev mode state
  const [devMode, setDevMode] = useState(false);
  const [devName, setDevName] = useState("");
  const [devEmail, setDevEmail] = useState("");
  const [devRole, setDevRole] = useState<"client" | "mentor">("client");
  
  const { login, devLogin, isLoading, error, isAuthenticated, user, isDevMode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Set initial tab based on dev mode status
  const [activeTab, setActiveTab] = useState(isDevMode ? "dev" : "normal");

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
  
  const validateDevForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!devName) {
      errors.devName = "Nome é obrigatório";
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
  
  const handleDevSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateDevForm()) {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Nome inválido",
        description: "Por favor, informe um nome para continuar",
      });
      return;
    }
    
    try {
      console.log("Tentando login em modo desenvolvedor:", { 
        email: devEmail || 'dev@example.com', 
        name: devName, 
        role: devRole 
      });
      
      await devLogin(devEmail || 'dev@example.com', devName, devRole);
      
      toast({
        title: "Modo desenvolvedor ativado",
        description: `Logado como ${devRole}: ${devName}`,
      });
      
    } catch (error) {
      console.error("Erro no login dev:", error);
      toast({
        variant: "destructive",
        title: "Erro no login dev",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="normal">Login Normal</TabsTrigger>
              <TabsTrigger value="dev">Modo Desenvolvedor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="normal">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
            </TabsContent>
            
            <TabsContent value="dev">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-sm text-yellow-700">
                  <strong>Modo Desenvolvedor</strong> - Use este modo para testar a aplicação sem precisar de credenciais reais.
                </p>
              </div>
              
              <form onSubmit={handleDevSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="devName">Nome</Label>
                  <Input
                    id="devName"
                    type="text"
                    value={devName}
                    onChange={(e) => setDevName(e.target.value)}
                    placeholder="Seu nome no modo desenvolvedor"
                    className={getFieldErrorClass("devName")}
                  />
                  {formErrors.devName && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.devName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="devEmail">Email (opcional)</Label>
                  <Input
                    id="devEmail"
                    type="email"
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    placeholder="Email opcional (será preenchido automaticamente)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Função</Label>
                  <RadioGroup 
                    value={devRole} 
                    onValueChange={(value: "mentor" | "client") => setDevRole(value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="client" id="client" />
                      <Label htmlFor="client">Cliente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mentor" id="mentor" />
                      <Label htmlFor="mentor">Mentor</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button type="submit" className="w-full" variant="secondary" disabled={isLoading || isSubmitting}>
                  {isLoading || isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando no modo dev...
                    </>
                  ) : (
                    "Entrar como " + (devRole === "mentor" ? "Mentor" : "Cliente")
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
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
