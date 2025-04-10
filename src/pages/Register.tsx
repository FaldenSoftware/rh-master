import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (formErrors.email) setFormErrors(prev => ({ ...prev, email: "" }));
  }, [email]);

  useEffect(() => {
    if (formErrors.password) setFormErrors(prev => ({ ...prev, password: "" }));
  }, [password]);

  useEffect(() => {
    if (formErrors.confirmPassword) setFormErrors(prev => ({ ...prev, confirmPassword: "" }));
  }, [confirmPassword]);

  useEffect(() => {
    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }));
  }, [name]);

  useEffect(() => {
    if (formErrors.company) setFormErrors(prev => ({ ...prev, company: "" }));
  }, [company]);

  // Reset rate limiting after timeout
  useEffect(() => {
    let timerId: number | null = null;
    
    if (isRateLimited) {
      timerId = window.setTimeout(() => {
        setIsRateLimited(false);
        setGeneralError(null);
      }, 30000); // 30 seconds timeout
    }
    
    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [isRateLimited]);

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
    } else if (password.length < 6) {
      errors.password = "A senha deve ter pelo menos 6 caracteres";
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirme sua senha";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }

    if (!name || name.trim() === '') {
      errors.name = "Nome é obrigatório";
      isValid = false;
    }

    if (!company || company.trim() === '') {
      errors.company = "Empresa é obrigatória para mentores";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    
    // Prevent submission if rate limited
    if (isRateLimited) {
      toast({
        variant: "destructive",
        title: "Tentativas limitadas",
        description: "Aguarde alguns segundos antes de tentar novamente.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        toast({
          variant: "destructive",
          title: "Campos inválidos",
          description: "Por favor, corrija os erros no formulário",
        });
        return;
      }
      
      console.log("Registrando mentor com empresa:", company);
      
      const trimmedCompany = company.trim();
      const trimmedPhone = phone.trim() || undefined;
      const trimmedPosition = position.trim() || undefined;
      const trimmedBio = bio.trim() || undefined;
      
      const user = await register(
        email.trim(), 
        password, 
        name.trim(), 
        "mentor", 
        trimmedCompany,
        trimmedPhone,
        trimmedPosition,
        trimmedBio
      );
      
      if (user) {
        toast({
          title: "Registro realizado com sucesso",
          description: "Redirecionando para o painel...",
        });
      } else {
        throw new Error("Falha ao registrar usuário. Tente novamente.");
      }
      
    } catch (error) {
      console.error("Erro capturado na página de registro:", error);
      
      if (error instanceof Error) {
        setGeneralError(error.message);
        
        // Check if error is related to rate limiting
        if (error.message.toLowerCase().includes('security purposes') || 
            error.message.toLowerCase().includes('aguarde') ||
            error.message.toLowerCase().includes('segundos')) {
          setIsRateLimited(true);
        }
        
        if (error.message.toLowerCase().includes("empresa é obrigatória") || 
            error.message.toLowerCase().includes("company is required")) {
          setFormErrors(prev => ({ ...prev, company: "Empresa é obrigatória para mentores" }));
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao registrar",
          description: error.message,
        });
      } else {
        setGeneralError("Ocorreu um erro desconhecido ao registrar. Por favor, tente novamente.");
        toast({
          variant: "destructive",
          title: "Erro ao registrar",
          description: "Ocorreu um erro desconhecido. Por favor, tente novamente.",
        });
      }
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
          <CardTitle className="text-2xl font-bold text-center">Criar Conta de Mentor</CardTitle>
          <CardDescription className="text-center">
            Registre-se como mentor para começar a convidar seus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generalError && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

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
                className={getFieldErrorClass("name")}
              />
              {formErrors.name && (
                <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
              )}
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme sua senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Digite novamente sua senha"
                className={getFieldErrorClass("confirmPassword")}
              />
              {formErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center">
                Empresa <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                placeholder="Digite o nome da sua empresa"
                className={getFieldErrorClass("company")}
              />
              {formErrors.company && (
                <p className="text-xs text-red-500 mt-1">{formErrors.company}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">Campo obrigatório para mentores</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (Opcional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Digite seu telefone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo/Posição (Opcional)</Label>
              <Input
                id="position"
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Qual seu cargo na empresa?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Sobre você (Opcional)</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Fale um pouco sobre sua experiência"
                className="min-h-[80px]"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
              {(isLoading || isSubmitting) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar como Mentor"
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

export default Register;
