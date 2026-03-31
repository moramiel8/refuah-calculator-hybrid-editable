import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CalculatorPage from "@/app/pages/CalculatorPage";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex min-h-0 flex-1 flex-col">
          <CalculatorPage />
        </main>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
