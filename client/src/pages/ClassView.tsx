import { useParams, Link } from "wouter";
import { CLASSES, ASSIGNMENTS, FEED_ITEMS, Role } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calendar, Clock, FileText, MoreHorizontal, Users, Download, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ClassViewProps {
  role: Role;
}

export default function ClassView({ role }: ClassViewProps) {
  const params = useParams();
  const classId = params.id;
  const classData = CLASSES.find(c => c.id === classId);

  if (!classData) return <div>Class not found</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent hover:text-primary">
        <Link href="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      {/* Class Hero Header */}
      <div 
        className="rounded-xl overflow-hidden shadow-sm border bg-card text-card-foreground relative"
      >
        <div 
            className="h-32 w-full absolute top-0 left-0 opacity-10"
            style={{ backgroundColor: classData.color }}
        />
        <div className="relative p-6 md:p-8 pt-12">
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-end">
                <div>
                    <Badge variant="outline" className="mb-2 bg-background/50 backdrop-blur-sm">
                        {classData.code}
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight">{classData.name}</h1>
                    <div className="flex items-center gap-4 mt-3 text-muted-foreground text-sm">
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1.5" />
                            {classData.teacher}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1.5" />
                            {classData.schedule}
                        </div>
                    </div>
                </div>
                {role === 'teacher' && (
                    <Button>
                        <MoreHorizontal className="w-4 h-4 mr-2" />
                        Manage Class
                    </Button>
                )}
            </div>
        </div>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="bg-transparent p-0 border-b border-border w-full justify-start rounded-none h-auto">
            <TabsTrigger 
                value="feed" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
                Stream
            </TabsTrigger>
            <TabsTrigger 
                value="assignments" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
                Assignments
            </TabsTrigger>
            <TabsTrigger 
                value="people" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
                People
            </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* Create Post Box */}
                <Card>
                    <CardContent className="p-4 flex gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>Me</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="h-10 rounded-full bg-muted/50 flex items-center px-4 text-sm text-muted-foreground cursor-pointer hover:bg-muted transition-colors">
                                Announce something to your class...
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Feed Items */}
                {FEED_ITEMS.filter(f => f.classId === classId || f.classId).map(item => (
                    <Card key={item.id}>
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                            <div className={`p-2 rounded-full ${item.type === 'assignment' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                {item.type === 'assignment' ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-sm">{item.author}</h3>
                                    <span className="text-xs text-muted-foreground">{item.date}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5 capitalize">{item.type}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="pl-[4.5rem]">
                            <p className="text-sm leading-relaxed">{item.content}</p>
                            {item.type === 'assignment' && (
                                <Button variant="outline" size="sm" className="mt-4">
                                    View Assignment
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Upcoming</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {ASSIGNMENTS.filter(a => a.classId === classId && a.status === 'pending').length > 0 ? (
                            ASSIGNMENTS.filter(a => a.classId === classId && a.status === 'pending').map(a => (
                                <div key={a.id} className="flex flex-col gap-1">
                                    <span className="text-sm font-medium">{a.title}</span>
                                    <span className="text-xs text-muted-foreground">Due {new Date(a.dueDate).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No work due soon!</p>
                        )}
                        <Button variant="link" className="px-0 text-xs">View all</Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
             {ASSIGNMENTS.filter(a => a.classId === classId).map(assignment => (
                 <Card key={assignment.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-muted rounded-md">
                                <FileText className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-medium">{assignment.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                    <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                    <Separator orientation="vertical" className="h-3" />
                                    <span>{assignment.points} points</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant={assignment.status === 'submitted' ? 'secondary' : assignment.status === 'graded' ? 'default' : 'outline'}>
                                {assignment.status}
                            </Badge>
                            {assignment.status === 'graded' && (
                                <span className="text-sm font-bold">{assignment.grade}/100</span>
                            )}
                        </div>
                    </CardContent>
                 </Card>
             ))}
        </TabsContent>

        <TabsContent value="people">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg text-primary">Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 py-2">
                        <Avatar>
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{classData.teacher}</span>
                    </div>
                </CardContent>
                <Separator />
                <CardHeader>
                    <CardTitle className="text-lg text-primary flex justify-between items-center">
                        Students
                        <Badge variant="secondary" className="text-xs font-normal">{classData.students} students</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-1">
                             <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>ST</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Student Name {i + 1}</span>
                             </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
