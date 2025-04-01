
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LeaderDashboard from "./pages/LeaderDashboard";
import LeaderClients from "./pages/LeaderClients";
import LeaderResults from "./pages/LeaderResults";
import LeaderRankings from "./pages/LeaderRankings";
import LeaderReports from "./pages/LeaderReports";
import LeaderSubscription from "./pages/LeaderSubscription";
import LeaderSettings from "./pages/LeaderSettings";
import ClientDashboard from "./pages/ClientDashboard";
import ClientTests from "./pages/ClientTests";
import ClientResults from "./pages/ClientResults";
import ClientProfile from "./pages/ClientProfile";
import ClientAccount from "./pages/ClientAccount";
import ClientLogin from "./pages/ClientLogin";

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Leader Routes */}
              <Route path="/leader" element={<LeaderDashboard />} />
              <Route path="/leader/clients" element={<LeaderClients />} />
              <Route path="/leader/results" element={<LeaderResults />} />
              <Route path="/leader/rankings" element={<LeaderRankings />} />
              <Route path="/leader/reports" element={<LeaderReports />} />
              <Route path="/leader/subscription" element={<LeaderSubscription />} />
              <Route path="/leader/settings" element={<LeaderSettings />} />
              
              {/* Client Routes */}
              <Route path="/client/login" element={<ClientLogin />} />
              <Route path="/client" element={<ClientDashboard />} />
              <Route path="/client/tests" element={<ClientTests />} />
              <Route path="/client/results" element={<ClientResults />} />
              <Route path="/client/profile" element={<ClientProfile />} />
              <Route path="/client/account" element={<ClientAccount />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
