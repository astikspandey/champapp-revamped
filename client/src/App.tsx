import { Switch, Route, useLocation } from "wouter";
import { useState } from "react";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import MyClasses from "@/pages/MyClasses";
import ClassView from "@/pages/ClassView";
import Assignments from "@/pages/Assignments";
import Announcements from "@/pages/Announcements";
import Newsletter from "@/pages/Newsletter";
import NoticeBoard from "@/pages/NoticeBoard";
import Messages from "@/pages/Messages";
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
                <Route path="/my-classes">
                  <MyClasses role={role} />
                </Route>
                <Route path="/assignments">
                  <Assignments role={role} />
                </Route>
                <Route path="/announcements">
                  <Announcements role={role} />
                </Route>
                <Route path="/newsletter">
                  <Newsletter role={role} />
                </Route>
                <Route path="/notices">
                  <NoticeBoard role={role} />
                </Route>
                <Route path="/messages">
                  <Messages role={role} />
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
            <Landing onLogin={handleLogin} />
          </Route>
        )}
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
