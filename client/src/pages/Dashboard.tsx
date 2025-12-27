import { CLASSES, USERS, ASSIGNMENTS, FEED_ITEMS, Role } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, MoreVertical, Calendar as CalendarIcon, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

interface DashboardProps {
  role: Role;
}

export default function Dashboard({ role }: DashboardProps) {
  const user = USERS[role];
  const relevantAssignments = ASSIGNMENTS.filter(a => role === 'student' ? true : true); // In real app, filter by user
  
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
                    ? "You have 2 assignments due this week." 
                    : "You have 3 classes scheduled for today."}
            </p>
        </div>
        <div className="flex gap-3">
             <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Full Schedule
             </Button>
             {role === 'teacher' && (
                 <Button>
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Create Class
                 </Button>
             )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Classes */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Classes</h2>
                <Button variant="link" className="text-primary p-0 h-auto">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CLASSES.map((cls, i) => (
                    <Link key={cls.id} href={`/class/${cls.id}`}>
                        <Card 
                            className="cursor-pointer group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-l-4 overflow-hidden"
                            style={{ borderLeftColor: cls.color }}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="font-mono text-xs font-normal">
                                        {cls.code}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-muted-foreground">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">{cls.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm text-muted-foreground mb-4">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {cls.nextClass}
                                </div>
                                
                                {role === 'student' ? (
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span>Progress</span>
                                            <span className="font-medium">{cls.progress}%</span>
                                        </div>
                                        <Progress value={cls.progress} className="h-2" />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{cls.students} Students</span>
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(n => (
                                                <div key={n} className="w-6 h-6 rounded-full border-2 border-background bg-slate-200" />
                                            ))}
                                            <div className="w-6 h-6 rounded-full border-2 border-background bg-slate-100 flex items-center justify-center text-[10px] text-muted-foreground">
                                                +{cls.students - 3}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>

        {/* Right Column: Feed & Tasks */}
        <div className="space-y-6">
            <Card className="h-full border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">
                        {role === 'student' ? 'Upcoming Tasks' : 'Recent Submissions'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                    {relevantAssignments.slice(0, 3).map((assignment) => (
                        <div key={assignment.id} className="flex items-start gap-3 p-3 rounded-lg bg-card border shadow-sm hover:shadow-md transition-shadow">
                            <div className={`mt-1 p-1.5 rounded-full shrink-0 ${
                                assignment.status === 'submitted' ? 'bg-green-100 text-green-600' : 
                                assignment.status === 'graded' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{assignment.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                            {assignment.grade && (
                                <Badge variant="outline" className="ml-auto font-mono">
                                    {assignment.grade}/100
                                </Badge>
                            )}
                        </div>
                    ))}
                    <Button variant="outline" className="w-full text-xs h-9">
                        View All Assignments
                    </Button>
                </CardContent>
            </Card>

            <div className="pt-4 border-t border-border">
                <h3 className="font-semibold mb-4">Class Activity</h3>
                <div className="space-y-6 relative pl-4 border-l border-border/60">
                    {FEED_ITEMS.map((item, i) => (
                        <div key={item.id} className="relative">
                            <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-border ring-4 ring-background" />
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-primary">{item.author}</span>
                                    <span className="text-[10px] text-muted-foreground">{item.date}</span>
                                </div>
                                <p className="text-sm text-foreground/90 leading-relaxed">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
