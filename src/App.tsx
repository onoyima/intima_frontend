import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { AgeGate } from "@/components/AgeGate";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import Home from "@/pages/Home";
import Dating from "@/pages/Dating";
import Couple from "@/pages/Couple";
import Cycle from "@/pages/Cycle";
import Profile from "@/pages/Profile";
import Wallet from "@/pages/Wallet";
import Admin from "@/pages/Admin";
import Preferences from "@/pages/Preferences";
import Resolver from "@/pages/Resolver";
import Community from "@/pages/Community";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return <Component {...rest} />;
}

import { socket } from "@/lib/socket";

function Router() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.connect(user.id, queryClient);
    }
  }, [user]);
  
  return (
    <>
      <Switch>
        <Route path="/" component={() => <ProtectedRoute component={Home} />} />
        <Route path="/dating" component={() => <ProtectedRoute component={Dating} />} />
        <Route path="/couple" component={() => <ProtectedRoute component={Couple} />} />
        <Route path="/cycle" component={() => <ProtectedRoute component={Cycle} />} />
        <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
        <Route path="/wallet" component={() => <ProtectedRoute component={Wallet} />} />
        <Route path="/admin" component={() => <ProtectedRoute component={Admin} />} />
        <Route path="/preferences" component={() => <ProtectedRoute component={Preferences} />} />
        <Route path="/resolver" component={() => <ProtectedRoute component={Resolver} />} />
        <Route path="/community" component={() => <ProtectedRoute component={Community} />} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
      {user && <Navigation />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AgeGate>
        <Router />
      </AgeGate>
    </QueryClientProvider>
  );
}

export default App;
