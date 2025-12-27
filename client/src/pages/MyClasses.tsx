import { CLASSES, Role } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, MoreVertical, Users, Plus } from "lucide-react";
import { Link } from "wouter";

interface MyClassesProps {
  role: Role;
}

export default function MyClasses({ role }: MyClassesProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground mt-1">
            {role === 'student' ? "View and manage your enrolled classes" : "Manage your teaching classes"}
          </p>
        </div>
        {role === 'teacher' && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Class
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLASSES.map((cls) => (
          <Link key={cls.id} href={`/class/${cls.id}`}>
            <Card 
              className="cursor-pointer group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-l-4 overflow-hidden h-full"
              style={{ borderLeftColor: cls.color }}
            >
              <div
                className="h-20 w-full opacity-10"
                style={{ backgroundColor: cls.color }}
              />
              <CardHeader className="pb-2 relative -mt-12">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="font-mono text-xs font-normal bg-background/70 backdrop-blur-sm">
                    {cls.code}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-muted-foreground hover:bg-muted/50">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{cls.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{cls.teacher}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {cls.schedule}
                  </div>
                </div>

                {role === 'student' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span className="font-medium">{cls.progress}%</span>
                    </div>
                    <Progress value={cls.progress} className="h-2" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{cls.students} Students</span>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(n => (
                        <div key={n} className="w-6 h-6 rounded-full border-2 border-background bg-slate-200" />
                      ))}
                      {cls.students > 3 && (
                        <div className="w-6 h-6 rounded-full border-2 border-background bg-slate-100 flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                          +{cls.students - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                  Next class: {cls.nextClass}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
