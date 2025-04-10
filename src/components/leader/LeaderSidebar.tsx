
import { Link } from "react-router-dom";
import { Home, Users, LineChart, Award, FileText, CreditCard, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/leader" },
  { icon: Users, label: "Clientes", href: "/leader/clients" },
  { icon: LineChart, label: "Resultados", href: "/leader/results" },
  { icon: Award, label: "Rankings", href: "/leader/rankings" },
  { icon: FileText, label: "Relatórios", href: "/leader/reports" },
  { icon: CreditCard, label: "Assinatura", href: "/leader/subscription" },
  { icon: Settings, label: "Configurações", href: "/leader/settings" }
];

const LeaderSidebar = () => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState<string>("");
  
  useEffect(() => {
    // Buscar os dados do perfil do usuário quando o componente for montado
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          console.log("Buscando perfil do usuário:", user.id);
          
          // Buscar todos os campos do perfil para depuração
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Erro ao buscar perfil:', error);
            return;
          }
          
          console.log("Dados do perfil:", data);
          
          // Verificar se o campo company existe e tem um valor
          if (data?.company) {
            console.log("Nome da empresa encontrado:", data.company);
            setCompanyName(data.company);
          } else {
            console.log("Campo company não encontrado ou vazio");
            // Usar tipagem any para acessar campos que podem não estar definidos no tipo
            const profileData = data as any;
            
            // Verificar se há outros campos que possam conter o nome da empresa
            if (profileData?.company_name) {
              setCompanyName(profileData.company_name);
            } else if (profileData?.organization) {
              setCompanyName(profileData.organization);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
        }
      }
    };
    
    fetchUserProfile();
    
    // Configurar um intervalo para verificar periodicamente se o nome da empresa foi atualizado
    const intervalId = setInterval(fetchUserProfile, 30000); // Verificar a cada 30 segundos
    
    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [user]);
  
  return (
    <aside className="hidden md:flex h-screen w-64 flex-col bg-white border-r pt-6">
      <div className="flex px-6 py-2">
        <h2 className="text-lg font-semibold">Painel de Controle</h2>
      </div>
      <nav className="flex-1 pt-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto px-6 py-4 border-t">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">Empresa</p>
          {companyName ? (
            <p className="text-sm font-medium">{companyName}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Não configurada</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default LeaderSidebar;
