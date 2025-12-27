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
    color: "hsl(221, 83%, 53%)",
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
    color: "hsl(25, 95%, 58%)",
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
    color: "hsl(160, 60%, 45%)",
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
    color: "hsl(340, 75%, 55%)",
    progress: 88,
    nextClass: "Monday, 2:00 PM"
  }
];

export const ASSIGNMENTS = [
  {
    id: "a1",
    classId: "c1",
    className: "Advanced Mathematics",
    subject: "Mathematics",
    title: "Calculus Problem Set 4",
    dueDate: "2024-03-15",
    status: "pending",
    grade: null,
    points: 100,
    description: "Complete problems 1-25 from chapter 4"
  },
  {
    id: "a2",
    classId: "c2",
    className: "World History",
    subject: "History",
    title: "The Industrial Revolution Essay",
    dueDate: "2024-03-12",
    status: "submitted",
    grade: null,
    points: 50,
    description: "5-page essay on the social impact of industrialization"
  },
  {
    id: "a3",
    classId: "c1",
    className: "Advanced Mathematics",
    subject: "Mathematics",
    title: "Midterm Review",
    dueDate: "2024-03-01",
    status: "graded",
    grade: 92,
    points: 100,
    description: "Midterm exam review session"
  },
  {
    id: "a4",
    classId: "c3",
    className: "Physics I",
    subject: "Physics",
    title: "Lab Report: Pendulums",
    dueDate: "2024-03-18",
    status: "pending",
    grade: null,
    points: 25,
    description: "Experimental lab report on pendulum motion"
  },
  {
    id: "a5",
    classId: "c4",
    className: "Literature & Composition",
    subject: "English",
    title: "Poetry Analysis",
    dueDate: "2024-03-20",
    status: "pending",
    grade: null,
    points: 40,
    description: "Analyze 3 poems from the Romantic period"
  }
];

export const ANNOUNCEMENTS = [
  {
    id: "an1",
    author: "Dr. Sarah Chen",
    classId: "c1",
    className: "Advanced Mathematics",
    title: "Reminder: Graphing Calculator Workshop",
    content: "Remember to bring your graphing calculators for tomorrow's workshop. We will be covering derivatives and optimization problems.",
    date: "2 hours ago",
    priority: "normal"
  },
  {
    id: "an2",
    author: "Ms. Emily Bronte",
    classId: "c4",
    className: "Literature & Composition",
    title: "Poetry Recital Grades Posted",
    content: "Great job on the poetry recitals everyone! Grades have been posted in the Grades section.",
    date: "1 day ago",
    priority: "high"
  },
  {
    id: "an3",
    author: "Mr. James Wilson",
    classId: "c2",
    className: "World History",
    title: "Museum Trip Update",
    content: "The museum trip has been rescheduled to April 15th. Permission slips are due by March 25th.",
    date: "3 days ago",
    priority: "normal"
  },
  {
    id: "an4",
    author: "Prof. Alan Turing",
    classId: "c3",
    className: "Physics I",
    title: "Lab Session Cancelled",
    content: "Friday's lab session is cancelled. We will reschedule it for next week.",
    date: "1 week ago",
    priority: "high"
  }
];

export const NEWSLETTERS = [
  {
    id: "nl1",
    title: "Weekly Campus Digest",
    content: "This week's highlights: Spring sports season begins, new library extended hours, student spotlight on debate team.",
    date: "2024-03-10",
    category: "Campus News"
  },
  {
    id: "nl2",
    title: "Academic Excellence Awards",
    content: "Congratulations to our students and faculty who received academic excellence awards this month.",
    date: "2024-03-03",
    category: "Achievements"
  },
  {
    id: "nl3",
    title: "Technology Workshops Available",
    content: "Free workshops on coding, digital design, and AI literacy are now available. Sign up today!",
    date: "2024-02-24",
    category: "Professional Development"
  }
];

export const NOTICES = [
  {
    id: "n1",
    title: "System Maintenance - Saturday 2-4 AM",
    content: "The platform will be down for scheduled maintenance.",
    date: "2024-03-15",
    status: "urgent"
  },
  {
    id: "n2",
    title: "Spring Break Schedule",
    content: "School will be closed from March 18-22 for spring break.",
    date: "2024-03-01",
    status: "important"
  },
  {
    id: "n3",
    title: "New Attendance Policy",
    content: "Updated attendance policy effective immediately. See student handbook for details.",
    date: "2024-02-28",
    status: "normal"
  }
];

export const TASKS = [
  {
    id: "t1",
    title: "Complete Calculus homework",
    dueDate: "2024-03-15",
    priority: "high",
    subject: "Mathematics",
    completed: false,
    order: 1
  },
  {
    id: "t2",
    title: "Read Chapter 5 for History",
    dueDate: "2024-03-18",
    priority: "medium",
    subject: "History",
    completed: false,
    order: 2
  },
  {
    id: "t3",
    title: "Study for Physics quiz",
    dueDate: "2024-03-12",
    priority: "high",
    subject: "Physics",
    completed: false,
    order: 3
  },
  {
    id: "t4",
    title: "Write essay outline",
    dueDate: "2024-03-20",
    priority: "medium",
    subject: "English",
    completed: true,
    order: 4
  }
];

export const FEED_ITEMS = [
  {
    id: "f1",
    author: "Dr. Sarah Chen",
    classId: "c1",
    content: "New assignment posted: Calculus Problem Set 5",
    date: "2 hours ago",
    type: "assignment"
  },
  {
    id: "f2",
    author: "Ms. Emily Bronte",
    classId: "c4",
    content: "Grades have been updated for poetry recitals",
    date: "5 hours ago",
    type: "grade"
  },
  {
    id: "f3",
    author: "System",
    classId: "c2",
    content: "Class announcement: Museum trip rescheduled to April 15",
    date: "1 day ago",
    type: "announcement"
  }
];

export const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Classes", href: "/my-classes" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: FileText, label: "Assignments", href: "/assignments" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Users, label: "Directory", href: "/directory" },
];
