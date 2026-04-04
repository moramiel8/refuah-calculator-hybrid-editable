import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CalculatorTabs from "@/features/calculator/ui/CalculatorTabs";
import { useReportIframeHeightToRefuahParent } from "@/features/calculator/lib/reportIframeHeightToRefuah";

const queryClient = new QueryClient();

const AppShell = () => {
  useReportIframeHeightToRefuahParent();
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      <main className="mx-auto w-full min-w-0 max-w-2xl px-4 py-4">
        <CalculatorTabs />
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppShell />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
