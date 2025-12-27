import { CLASSES, USERS, ASSIGNMENTS, ANNOUNCEMENTS, NEWSLETTERS, NOTICES, FEED_ITEMS, Role } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BookOpen, MoreVertical, Calendar as CalendarIcon, ArrowUpRight, CheckCircle2, FileText, Bell, Megaphone, Mail, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import TaskList from "@/components/TaskList";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface DashboardProps {
  role: Role;
}

export default function Dashboard({ role }: DashboardProps) {
  const user = USERS[role];
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting()}, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">
            {role === 'student' 
              ? "Manage your classes, assignments, and tasks all in one place." 
              : "View your classes and student submissions."}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          {role === 'teacher' && (
            <Button>
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:grid-cols-6 bg-transparent p-0 border-b border-border rounded-none h-auto gap-0">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-2 md:px-4 py-2">
            Overview
          </TabsTrigger>
          <TabsTrigger value="assignments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-2 md:px-4 py-2">
            <FileText className="w-4 h-4 mr-2 md:block hidden" />
            <span className="hidden md:inline">Assignments</span>
            <span className="md:hidden">Work</span>
          </TabsTrigger>
          <TabsTrigger value="announcements" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-2 md:px-4 py-2">
            <Megaphone className="w-4 h-4 mr-2 md:block hidden" />
            <span className="hidden md:inline">Announcements</span>
            <span className="md:hidden">News</span>
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-2 md:px-4 py-2">
            <Mail className="w-4 h-4 mr-2 md:block hidden" />
            <span className="hidden md:inline">Newsletter</span>
            <span className="md:hidden">Letter</span>
          </TabsTrigger>
          <TabsTrigger value="notices" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-2 md:px-4 py-2">
            <Bell className="w-4 h-4 mr-2 md:block hidden" />
            <span className="hidden md:inline">Notices</span>
            <span className="md:hidden">Alert</span>
          </TabsTrigger>
          {role === 'teacher' && (
            <TabsTrigger value="messages" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-2 md:px-4 py-2">
              Send Message
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Latest Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Latest Assignments */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Recent Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ASSIGNMENTS.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{assignment.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{assignment.className}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-2 shrink-0">
                        <Badge variant={assignment.status === 'graded' ? 'secondary' : assignment.status === 'submitted' ? 'outline' : 'default'} className="text-xs">
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full text-xs mt-2">View All Assignments</Button>
                </CardContent>
              </Card>

              {/* Latest Announcements */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-accent" />
                    Latest Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ANNOUNCEMENTS.slice(0, 2).map((announcement) => (
                    <div key={announcement.id} className="border-l-2 border-accent pl-3 py-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{announcement.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{announcement.author} • {announcement.date}</p>
                        </div>
                        {announcement.priority === 'high' && (
                          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full text-xs mt-2">View All Announcements</Button>
                </CardContent>
              </Card>
            </div>

            {/* Right: Task List & Quick Stats */}
            <div className="space-y-6">
              <TaskList />

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">This Week</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Assignments Due</span>
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Classes</span>
                    <span className="text-2xl font-bold text-primary">4</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tasks Completed</span>
                    <span className="text-2xl font-bold text-accent">1/4</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Mathematics', 'History', 'Physics', 'English'].map((subject) => {
              const subjectAssignments = ASSIGNMENTS.filter(a => a.subject === subject);
              return (
                <Card key={subject} className="border-l-4" style={{ borderLeftColor: CLASSES.find(c => c.name.includes(subject.split(' ')[0]))?.color || 'hsl(221, 83%, 53%)' }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{subject}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{subjectAssignments.length} assignments</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {subjectAssignments.map((assignment) => (
                      <div key={assignment.id} className="p-2 rounded bg-muted/50 hover:bg-muted transition-colors">
                        <p className="text-sm font-medium truncate">{assignment.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          <Badge variant="outline" className="text-xs h-5">{assignment.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4 mt-6">
          {ANNOUNCEMENTS.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{announcement.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{announcement.author} • {announcement.className}</p>
                  </div>
                  {announcement.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs h-5">High Priority</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/90">{announcement.content}</p>
                <p className="text-xs text-muted-foreground mt-3">{announcement.date}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Newsletter Tab */}
        <TabsContent value="newsletter" className="space-y-4 mt-6">
          {NEWSLETTERS.map((newsletter) => (
            <Card key={newsletter.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{newsletter.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs h-5 mt-2">{newsletter.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/90">{newsletter.content}</p>
                <p className="text-xs text-muted-foreground mt-3">{new Date(newsletter.date).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Notices Tab */}
        <TabsContent value="notices" className="space-y-4 mt-6">
          {NOTICES.map((notice) => (
            <Card key={notice.id} className={`border-l-4 ${notice.status === 'urgent' ? 'border-l-destructive' : notice.status === 'important' ? 'border-l-orange-500' : 'border-l-primary'}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{notice.title}</CardTitle>
                  </div>
                  <Badge
                    variant={notice.status === 'urgent' ? 'destructive' : notice.status === 'important' ? 'secondary' : 'outline'}
                    className="text-xs h-5 capitalize"
                  >
                    {notice.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/90">{notice.content}</p>
                <p className="text-xs text-muted-foreground mt-3">{new Date(notice.date).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Create Assignment Tab (Teacher Only) */}
        {role === 'teacher' && (
          <TabsContent value="messages" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Class</label>
                    <select className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground">
                      {CLASSES.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assignment Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                      placeholder="e.g., Chapter 5 Essay"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground min-h-[100px]"
                      placeholder="Describe the assignment details..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Points</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <Button className="w-full">
                    Create Assignment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Send Message to Class</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Class</label>
                    <select className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground">
                      {CLASSES.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                      placeholder="e.g., Reminder about midterm..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground min-h-[100px]"
                      placeholder="Type your message here..."
                    />
                  </div>
                  <Button className="w-full">
                    Send Announcement
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
