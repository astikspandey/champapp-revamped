import { useState, useEffect } from "react";
import { Role } from "@/lib/mockData";
import { assignmentsApi, announcementsApi, tasksApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Megaphone, CheckCircle2, MessageSquare, Users as UsersIcon, BookOpen, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import TaskList from "@/components/TaskList";
import { useAuth } from "@/lib/auth";

interface DashboardProps {
  role: Role;
  userId: string;
}

export default function Dashboard({ role, userId }: DashboardProps) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assignmentsData, announcementsData] = await Promise.all([
          assignmentsApi.getAll(),
          announcementsApi.getAll()
        ]);
        setAssignments(assignmentsData);
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats
  const pendingAssignments = assignments.filter(a => a.status === "pending").length;
  const unreadAnnouncements = announcements.filter(a => a.priority === "high").length;

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting()}, {user?.username || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          {role === 'student'
            ? "Here's your overview for today. Stay on top of your assignments and tasks!"
            : "Welcome back! Here's a summary of your classes and student activity."}
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Assignments
            </CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingAssignments > 0 ? "Requires attention" : "All caught up!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Priority Alerts
            </CardTitle>
            <Megaphone className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadAnnouncements}</div>
            <p className="text-xs text-muted-foreground mt-1">
              High priority announcements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Tasks
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              View in task list
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {role === 'teacher' ? 'Active Classes' : 'Messages'}
            </CardTitle>
            {role === 'teacher' ? (
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            ) : (
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              {role === 'teacher' ? 'Classes teaching' : 'Total messages'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Updates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Latest Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Assignments */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Upcoming Assignments
                </CardTitle>
                <Link href="/assignments">
                  <a className="text-sm text-primary hover:underline">View All</a>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignments.filter(a => a.status === "pending").slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{assignment.className}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {assignment.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Due {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {assignments.filter(a => a.status === "pending").length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No pending assignments</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Latest Announcements */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-accent" />
                  Recent Announcements
                </CardTitle>
                <Link href="/announcements">
                  <a className="text-sm text-primary hover:underline">View All</a>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.slice(0, 2).map((announcement) => (
                <div key={announcement.id} className="border-l-2 border-accent pl-3 py-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{announcement.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {announcement.author} • {announcement.date}
                      </p>
                    </div>
                    {announcement.priority === 'high' && (
                      <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="text-center py-8">
                  <Megaphone className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No announcements</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Task List */}
        <div className="space-y-6">
          <TaskList userId={userId} />

          {/* Quick Actions for Teachers */}
          {role === 'teacher' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/assignments">
                  <a className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors text-sm">
                    <FileText className="w-4 h-4" />
                    View All Assignments
                  </a>
                </Link>
                <Link href="/messages">
                  <a className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors text-sm">
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </a>
                </Link>
                <Link href="/my-classes">
                  <a className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors text-sm">
                    <UsersIcon className="w-4 h-4" />
                    Manage Classes
                  </a>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
