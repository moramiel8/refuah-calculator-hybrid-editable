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
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col px-2 py-4 sm:px-3">
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
