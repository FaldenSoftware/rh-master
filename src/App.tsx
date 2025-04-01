
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leader" element={<LeaderDashboard />} />
          <Route path="/leader/clients" element={<LeaderClients />} />
          <Route path="/leader/results" element={<LeaderResults />} />
          <Route path="/leader/rankings" element={<LeaderRankings />} />
          <Route path="/leader/reports" element={<LeaderReports />} />
          <Route path="/leader/subscription" element={<LeaderSubscription />} />
          <Route path="/leader/settings" element={<LeaderSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
