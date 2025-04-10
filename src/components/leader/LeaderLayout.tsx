
import { ReactNode, useState } from "react";
import LeaderHeader from "./LeaderHeader";
import LeaderSidebar from "./LeaderSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface LeaderLayoutProps {
  children: ReactNode;
  title: string;
}

const LeaderLayout = ({ children, title }: LeaderLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <LeaderHeader title={title} />
      <div className="flex flex-col md:flex-row">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
          <LeaderSidebar />
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

export default LeaderLayout;
