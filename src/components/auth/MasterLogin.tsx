import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, UserCircle, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface MasterLoginProps {
  onMasterLogin: (email: string) => void;
}

const MasterLogin: React.FC<MasterLoginProps> = ({ onMasterLogin }) => {
  // Constantes para emails das contas mestres (sem senhas)
  const MENTOR_MASTER_EMAIL = "mentor.mestre@rhmaster.space";
  const CLIENT_MASTER_EMAIL = "cliente.mestre@rhmaster.space";

  return (
    <div className="w-full space-y-4">
      <Separator className="my-4" />
      
      <div className="text-center">
        <h3 className="text-sm font-medium text-muted-foreground">Acesso para demonstração</h3>
      </div>
      
      <Alert variant="default" className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-700 text-sm">
          Estas contas são apenas para demonstração e suporte técnico. As ações realizadas são registradas para fins de auditoria.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-primary" />
              Mentor Mestre
            </CardTitle>
            <CardDescription className="text-xs">
              Acesso para demonstração de mentor
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs border-primary/20 text-primary"
              onClick={() => onMasterLogin(MENTOR_MASTER_EMAIL)}
            >
              <Key className="h-3 w-3 mr-1" />
              Preencher Email
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition-colors">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-indigo-600" />
              Cliente Mestre
            </CardTitle>
            <CardDescription className="text-xs">
              Acesso para demonstração de cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs border-indigo-300 text-indigo-600"
              onClick={() => onMasterLogin(CLIENT_MASTER_EMAIL)}
            >
              <Key className="h-3 w-3 mr-1" />
              Preencher Email
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-xs text-muted-foreground">
        <p>Ainda será necessário digitar a senha correspondente</p>
      </div>
    </div>
  );
};

export default MasterLogin;
