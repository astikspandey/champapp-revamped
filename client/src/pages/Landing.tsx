import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { USERS, Role } from "@/lib/mockData";
import logo from "@assets/generated_images/modern_minimal_education_logo_geometric_champion_trophy_concept.png";
import { ArrowRight, GraduationCap, School } from "lucide-react";

interface LandingProps {
  onLogin: (role: Role) => void;
}

export default function Landing({ onLogin }: LandingProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="max-w-md w-full space-y-8 z-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 transition-transform hover:rotate-6">
             <img src={logo} alt="ChampApp Logo" className="w-16 h-16 object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to ChampApp</h1>
            <p className="text-muted-foreground mt-2">The modern educational hub for everyone.</p>
          </div>
        </div>

        <div className="grid gap-4 mt-8">
          <Card 
            className="group cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
            onClick={() => onLogin('student')}
            data-testid="login-student"
          >
            <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-50 text-primary group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-lg">I am a Student</h3>
                        <p className="text-sm text-muted-foreground">Access your classes & assignments</p>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>

          <Card 
            className="group cursor-pointer hover:border-accent/50 transition-all hover:shadow-md"
            onClick={() => onLogin('teacher')}
            data-testid="login-teacher"
          >
            <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-orange-50 text-accent group-hover:scale-110 transition-transform">
                        <School className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-lg">I am a Teacher</h3>
                        <p className="text-sm text-muted-foreground">Manage classes & grade work</p>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
            This is a mock application for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
