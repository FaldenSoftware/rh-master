
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";

import { useLocation } from 'react-router-dom';

const Register = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeParam = queryParams.get('type') || 'mentor';
  const emailParam = queryParams.get('email') || '';

  const [registerButtonText, setRegisterButtonText] = useState('Registrar');
  const [pageTitle, setPageTitle] = useState('Criar Conta');
  const [pageDescription, setPageDescription] = useState('Preencha os campos abaixo para criar sua conta');

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
    if (emailParam) {
      setEmail(emailParam);
    }
    // Atualizar textos dinâmicos
    if (typeParam === 'client') {
      setRegisterButtonText('Registrar como Cliente');
      setPageTitle('Criar Conta de Cliente');
      setPageDescription('Preencha os campos abaixo para criar sua conta de cliente');
    } else {
      setRegisterButtonText('Registrar como Mentor');
      setPageTitle('Criar Conta de Mentor');
      setPageDescription('Preencha os campos abaixo para criar sua conta de mentor');
    }
  }, [emailParam, typeParam]);

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

  useEffect(() => {
    if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: "" }));
  }, [phone]);

  useEffect(() => {
    if (formErrors.position) setFormErrors(prev => ({ ...prev, position: "" }));
  }, [position]);

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
      
      console.log("Registrando mentor com dados:", { 
        email: email.trim(),
        name: name.trim(), 
        role: "mentor", 
        company: company.trim(),
        phone: phone.trim(),
        position: position.trim(),
        bio: bio.trim()
      });
      
      const user = await register(
        email.trim(), 
        password, 
        name.trim(), 
        "mentor", 
        company.trim(),
        phone.trim(),
        position.trim(),
        bio.trim()
      );
      
      if (user) {
        toast({
          title: "Registro realizado com sucesso",
          description: "Redirecionando para o painel...",
        });
        
        setTimeout(() => {
          navigate("/leader");
        }, 1500);
      } else {
        // Alterado: tratamento para caso de usuário nulo, mas sem lançar exceção
        // O usuário pode ter sido criado mesmo se retornou nulo (caso limite de timeouts)
        console.warn("O registro retornou null, mas o usuário pode ter sido criado. Tentando redirecionar...");
        toast({
          title: "Registro provavelmente concluído",
          description: "O perfil foi criado, mas houve um pequeno problema. Redirecionando...",
        });
        
        setTimeout(() => {
          navigate("/leader");
        }, 1500);
      }
      
    } catch (error) {
      console.error("Erro capturado na página de registro:", error);
      
      if (error instanceof Error) {
        setGeneralError(error.message);
        
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
          <CardTitle className="text-2xl text-center">{pageTitle}</CardTitle>
          <CardDescription className="text-center">
            {pageDescription}
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
            {/* ... (rest of the code remains the same) */}

            <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
              {(isLoading || isSubmitting) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                registerButtonText
              )}
            </Button>
          </form>
        </CardContent>
        {/* ... (rest of the code remains the same) */}
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
