
import { Link } from "react-router-dom";
import { Home, ClipboardCheck, LineChart, User, Award } from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/client" },
  { icon: ClipboardCheck, label: "Meus Testes", href: "/client/tests" },
  { icon: LineChart, label: "Resultados", href: "/client/results" },
  { icon: Award, label: "Perfil Comportamental", href: "/client/profile" },
  { icon: User, label: "Minha Conta", href: "/client/account" }
];

const ClientSidebar = () => {
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
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">Cliente</p>
          <p className="text-sm font-medium">João Silva</p>
          <p className="text-xs text-muted-foreground">Empresa ABC Ltda</p>
        </div>
      </div>
    </aside>
  );
};

export default ClientSidebar;
