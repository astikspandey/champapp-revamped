import { Switch, Route, useLocation, Redirect } from "wouter";
import { useEffect } from "react";
import Login from "@/pages/Login";
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
import { useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";

function App() {
  const { authenticated, user, loading, logout } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated and not on login page
    if (!loading && !authenticated && location !== "/login") {
      setLocation("/login");
    }
    // Redirect to dashboard if authenticated and on login page
    if (!loading && authenticated && location === "/login") {
      setLocation("/dashboard");
    }
  }, [authenticated, loading, location, setLocation]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>

        {/* Protected Routes */}
        {authenticated && user ? (
          <Route path="/:rest*">
            <Layout userRole={user.role} userName={user.username} userAvatar={user.profilePictureUrl} onLogout={logout}>
              <Switch>
                <Route path="/">
                  <Redirect to="/dashboard" />
                </Route>
                <Route path="/dashboard">
                  <Dashboard role={user.role} userId={user.id} />
                </Route>
                <Route path="/my-classes">
                  <MyClasses role={user.role} />
                </Route>
                <Route path="/assignments">
                  <Assignments role={user.role} />
                </Route>
                <Route path="/announcements">
                  <Announcements role={user.role} />
                </Route>
                <Route path="/newsletter">
                  <Newsletter role={user.role} />
                </Route>
                <Route path="/notices">
                  <NoticeBoard role={user.role} />
                </Route>
                <Route path="/messages">
                  <Messages role={user.role} />
                </Route>
                <Route path="/class/:id">
                  <ClassView role={user.role} />
                </Route>
                <Route component={NotFound} />
              </Switch>
            </Layout>
          </Route>
        ) : (
          <Route>
            <Redirect to="/login" />
          </Route>
        )}
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
