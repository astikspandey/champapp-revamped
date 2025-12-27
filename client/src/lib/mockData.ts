import { BookOpen, Calendar, CheckCircle, Clock, FileText, GraduationCap, LayoutDashboard, MessageSquare, Settings, Users, Bell, Megaphone, Mail } from "lucide-react";

export type Role = "student" | "teacher";

export const USERS = {
  student: {
    id: "s1",
    name: "Student User",
    role: "student" as Role,
    avatar: "",
    email: "student@school.edu"
  },
  teacher: {
    id: "t1",
    name: "Teacher User",
    role: "teacher" as Role,
    avatar: "",
    email: "teacher@school.edu"
  }
};

// Empty arrays - all data now comes from API/maindata.json
export const CLASSES: Array<{
  id: string;
  name: string;
  code: string;
  teacher: string;
  schedule: string;
  students: number;
  color: string;
  progress: number;
  nextClass: string;
  enrolledStudents: string[];
}> = [];

export const ASSIGNMENTS: Array<{
  id: string;
  classId: string;
  className: string;
  subject: string;
  title: string;
  dueDate: string;
  status: string;
  grade: number | null;
  points: number;
  description: string;
}> = [];

export const ANNOUNCEMENTS: Array<{
  id: string;
  author: string;
  classId: string;
  className: string;
  title: string;
  content: string;
  date: string;
  priority: string;
}> = [];

export const NEWSLETTERS: Array<{
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
}> = [];

export const NOTICES: Array<{
  id: string;
  title: string;
  content: string;
  date: string;
  status: string;
}> = [];

export const TASKS: Array<{
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  subject: string;
  completed: boolean;
  order: number;
}> = [];

export const FEED_ITEMS: Array<{
  id: string;
  author: string;
  classId: string;
  content: string;
  date: string;
  type: string;
}> = [];

export const SUBMISSIONS: Array<{
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedDate: string;
  status: "submitted" | "graded";
  grade: number | null;
  feedback: string | null;
}> = [];

export const MESSAGES: Array<{
  id: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  threadId: string;
}> = [];

export const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Classes", href: "/my-classes" },
  { icon: FileText, label: "Assignments", href: "/assignments" },
  { icon: Megaphone, label: "Announcements", href: "/announcements" },
  { icon: Mail, label: "Newsletter", href: "/newsletter" },
  { icon: Bell, label: "Notice Board", href: "/notices" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
];
