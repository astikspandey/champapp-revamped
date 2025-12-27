import { BookOpen, Calendar, CheckCircle, Clock, FileText, GraduationCap, LayoutDashboard, MessageSquare, Settings, Users, Bell } from "lucide-react";

export type Role = "student" | "teacher";

export const USERS = {
  student: {
    id: "s1",
    name: "Alex Rivera",
    role: "student" as Role,
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&h=150&fit=crop&crop=faces",
    email: "alex.rivera@champ.edu"
  },
  teacher: {
    id: "t1",
    name: "Dr. Sarah Chen",
    role: "teacher" as Role,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    email: "sarah.chen@champ.edu"
  }
};

export const CLASSES = [
  {
    id: "c1",
    name: "Advanced Mathematics",
    code: "MATH-301",
    teacher: "Dr. Sarah Chen",
    schedule: "Mon, Wed 10:00 AM",
    students: 28,
    color: "hsl(221, 83%, 53%)", // Primary Blue
    progress: 75,
    nextClass: "Wednesday, 10:00 AM"
  },
  {
    id: "c2",
    name: "World History",
    code: "HIST-102",
    teacher: "Mr. James Wilson",
    schedule: "Tue, Thu 1:00 PM",
    students: 32,
    color: "hsl(25, 95%, 58%)", // Accent Orange
    progress: 45,
    nextClass: "Tomorrow, 1:00 PM"
  },
  {
    id: "c3",
    name: "Physics I",
    code: "PHYS-201",
    teacher: "Prof. Alan Turing",
    schedule: "Fri 9:00 AM",
    students: 24,
    color: "hsl(160, 60%, 45%)", // Greenish
    progress: 60,
    nextClass: "Friday, 9:00 AM"
  },
  {
    id: "c4",
    name: "Literature & Composition",
    code: "ENG-101",
    teacher: "Ms. Emily Bronte",
    schedule: "Mon, Wed 2:00 PM",
    students: 30,
    color: "hsl(340, 75%, 55%)", // Pinkish
    progress: 88,
    nextClass: "Monday, 2:00 PM"
  }
];

export const ASSIGNMENTS = [
  {
    id: "a1",
    classId: "c1",
    title: "Calculus Problem Set 4",
    dueDate: "2024-03-15",
    status: "pending", // pending, submitted, graded
    grade: null,
    points: 100
  },
  {
    id: "a2",
    classId: "c2",
    title: "The Industrial Revolution Essay",
    dueDate: "2024-03-12",
    status: "submitted",
    grade: null,
    points: 50
  },
  {
    id: "a3",
    classId: "c1",
    title: "Midterm Review",
    dueDate: "2024-03-01",
    status: "graded",
    grade: 92,
    points: 100
  },
  {
    id: "a4",
    classId: "c3",
    title: "Lab Report: Pendulums",
    dueDate: "2024-03-18",
    status: "pending",
    grade: null,
    points: 25
  }
];

export const FEED_ITEMS = [
  {
    id: "f1",
    author: "Dr. Sarah Chen",
    classId: "c1",
    content: "Remember to bring your graphing calculators for tomorrow's workshop. We will be covering derivatives.",
    date: "2 hours ago",
    type: "announcement"
  },
  {
    id: "f2",
    author: "System",
    classId: "c2",
    content: "New Assignment Posted: The Industrial Revolution Essay",
    date: "5 hours ago",
    type: "assignment"
  },
  {
    id: "f3",
    author: "Ms. Emily Bronte",
    classId: "c4",
    content: "Great job on the poetry recitals everyone! Grades have been posted.",
    date: "1 day ago",
    type: "announcement"
  }
];

export const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Classes", href: "/classes" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: FileText, label: "Assignments", href: "/assignments" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Users, label: "Directory", href: "/directory" },
];
