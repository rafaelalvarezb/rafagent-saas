import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import { RequireAuth, useAuth } from "@/hooks/use-auth";
import Dashboard from "@/pages/Dashboard";
import Prospects from "@/pages/Prospects";
import Templates from "@/pages/Templates";
import Configuration from "@/pages/Configuration";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b sticky top-0 z-50 bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/">
              <RequireAuth>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </RequireAuth>
            </Route>
             <Route path="/prospects">
               <RequireAuth>
                 <AuthenticatedLayout>
                   <Prospects />
                 </AuthenticatedLayout>
               </RequireAuth>
             </Route>
             <Route path="/templates">
               <RequireAuth>
                 <AuthenticatedLayout>
                   <Templates />
                 </AuthenticatedLayout>
               </RequireAuth>
             </Route>
             <Route path="/configuration">
               <RequireAuth>
                 <AuthenticatedLayout>
                   <Configuration />
                 </AuthenticatedLayout>
               </RequireAuth>
             </Route>
             <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
