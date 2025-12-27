import { Switch, Route, useLocation } from "wouter";
import { useState } from "react";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import ClassView from "@/pages/ClassView";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { Role } from "@/lib/mockData";
import NotFound from "@/pages/not-found";

function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [location, setLocation] = useLocation();

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole);
    setLocation("/dashboard");
  };

  const handleLogout = () => {
    setRole(null);
    setLocation("/");
  };

  return (
    <>
        <Switch>
            <Route path="/">
                <Landing onLogin={handleLogin} />
            </Route>
            
            {/* Protected Routes */}
            {role ? (
                <Route path="/:rest*">
                    <Layout userRole={role} onLogout={handleLogout}>
                        <Switch>
                            <Route path="/dashboard">
                                <Dashboard role={role} />
                            </Route>
                            <Route path="/class/:id">
                                <ClassView role={role} />
                            </Route>
                             <Route component={NotFound} />
                        </Switch>
                    </Layout>
                </Route>
            ) : (
                 <Route>
                    {/* Redirect unauthenticated users back to landing if they try to access other routes */}
                    <Landing onLogin={handleLogin} />
                 </Route>
            )}
        </Switch>
        <Toaster />
    </>
  );
}

export default App;
