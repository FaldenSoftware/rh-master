
import { ReactNode, useState } from "react";
import ClientHeader from "./ClientHeader";
import ClientSidebar from "./ClientSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface ClientLayoutProps {
  children: ReactNode;
  title: string;
}

const ClientLayout = ({ children, title }: ClientLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />
      <div className="flex flex-col md:flex-row">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
          <ClientSidebar />
        </div>
        <main className="flex-1 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
