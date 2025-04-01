
import { ReactNode } from "react";
import LeaderHeader from "./LeaderHeader";
import LeaderSidebar from "./LeaderSidebar";

interface LeaderLayoutProps {
  children: ReactNode;
  title: string;
}

const LeaderLayout = ({ children, title }: LeaderLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LeaderHeader />
      <div className="flex">
        <LeaderSidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default LeaderLayout;
