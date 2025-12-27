import { useState, useEffect } from "react";
import { CLASSES, USERS, Role } from "@/lib/mockData";
import { assignmentsApi, tasksApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Pencil, Trash2 } from "lucide-react";
import AssignmentFormDialog from "@/components/teacher/AssignmentFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AssignmentsProps {
  role: Role;
}

export default function Assignments({ role }: AssignmentsProps) {
  const user = USERS[role];
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch assignments from API on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await assignmentsApi.getAll();
        setAssignments(data);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const subjects = ["all", "Mathematics", "History", "Physics", "English"];

  const filteredAssignments = activeSubject === "all"
    ? assignments
    : assignments.filter(a => a.subject === activeSubject);

  const getSubjectColor = (subject: string) => {
    const cls = CLASSES.find(c => c.name.includes(subject.split(' ')[0]));
    return cls?.color || 'hsl(221, 83%, 53%)';
  };

  const handleAddToTasks = async (assignment: typeof assignments[0]) => {
    try {
      // Get current tasks to determine order
      const currentTasks = await tasksApi.getAll(user.id);
      const newTask = {
        id: `task-${Date.now()}`,
        userId: user.id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        priority: 'medium',
        subject: assignment.subject,
        completed: false,
        order: currentTasks.length + 1,
        fromAssignment: true,
        assignmentId: assignment.id
      };
      await tasksApi.create(newTask);
      // Optionally show a success message or trigger a refresh
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleCreateAssignment = () => {
    setFormMode("create");
    setEditingAssignment(null);
    setIsFormOpen(true);
  };

  const handleEditAssignment = (assignment: any) => {
    setFormMode("edit");
    setEditingAssignment(assignment);
    setIsFormOpen(true);
  };

  const handleSaveAssignment = async (assignmentData: any) => {
    try {
      if (formMode === "create") {
        const newAssignment = await assignmentsApi.create(assignmentData);
        setAssignments([...assignments, newAssignment]);
      } else {
        const updatedAssignment = await assignmentsApi.update(assignmentData.id, assignmentData);
        setAssignments(assignments.map(a =>
          a.id === assignmentData.id ? updatedAssignment : a
        ));
      }
    } catch (error) {
      console.error("Failed to save assignment:", error);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    try {
      await assignmentsApi.delete(id);
      setAssignments(assignments.filter(a => a.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Assignments
          </h1>
          <p className="text-muted-foreground mt-1">
            {role === 'teacher'
              ? "Create and manage assignments for your classes"
              : "View and manage all your assignments organized by subject"}
          </p>
        </div>
        {role === 'teacher' && (
          <Button onClick={handleCreateAssignment}>
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </div>

      <Tabs value={activeSubject} onValueChange={setActiveSubject} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          {subjects.map((subject) => (
            <TabsTrigger key={subject} value={subject} className="capitalize">
              {subject}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <TabsContent key={subject} value={subject} className="mt-0 col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(subject === "all" ?
                  subjects.slice(1).map((subj) => ({
                    subject: subj,
                    assignments: assignments.filter(a => a.subject === subj)
                  })).filter(({ assignments }) => assignments.length > 0) :
                  [{ subject, assignments: filteredAssignments }]
                ).map(({ subject: subj, assignments: subjectAssignments }) => (
                  <div key={subj} className="space-y-4">
                    <Card
                      className="border-l-4"
                      style={{ borderLeftColor: getSubjectColor(subj) }}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{subj}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {subjectAssignments.length} assignment{subjectAssignments.length !== 1 ? 's' : ''}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {subjectAssignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="p-3 rounded bg-muted/50 hover:bg-muted transition-colors space-y-2"
                          >
                            <div>
                              <p className="text-sm font-medium">{assignment.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {assignment.className}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Due {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className="text-xs h-5">
                                {assignment.status}
                              </Badge>
                            </div>
                            {role === 'student' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full h-7 text-xs"
                                onClick={() => handleAddToTasks(assignment)}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add to Tasks
                              </Button>
                            )}
                            {role === 'teacher' && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 h-7 text-xs"
                                  onClick={() => handleEditAssignment(assignment)}
                                >
                                  <Pencil className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-destructive hover:text-destructive"
                                  onClick={() => setDeleteConfirm(assignment.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>

      <AssignmentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveAssignment}
        assignment={editingAssignment}
        mode={formMode}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the assignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDeleteAssignment(deleteConfirm)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
