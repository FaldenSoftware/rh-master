
import { Link } from "react-router-dom";
import { Home, ClipboardCheck, LineChart, User, Award, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/client" },
  { icon: ClipboardCheck, label: "Meus Testes", href: "/client/tests" },
  { icon: LineChart, label: "Resultados", href: "/client/results" },
  { icon: Award, label: "Perfil Comportamental", href: "/client/profile" },
  { icon: User, label: "Minha Conta", href: "/client/account" }
];

const ClientSidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col bg-white border-r pt-6">
      <div className="flex px-6 py-2">
        <h2 className="text-lg font-semibold">Portal do Cliente</h2>
      </div>
      <nav className="flex-1 pt-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto px-6 py-4 border-t">
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-xs text-muted-foreground">Cliente</p>
          <p className="text-sm font-medium">{user?.name || "Nome do Cliente"}</p>
          <p className="text-xs text-muted-foreground">{user?.company || "Empresa"}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center w-full justify-start"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
};

export default ClientSidebar;
