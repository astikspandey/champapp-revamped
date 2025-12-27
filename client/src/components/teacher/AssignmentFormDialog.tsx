import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASSES } from "@/lib/mockData";

interface AssignmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (assignment: any) => void;
  assignment?: any;
  mode: "create" | "edit";
}

export default function AssignmentFormDialog({
  open,
  onOpenChange,
  onSave,
  assignment,
  mode
}: AssignmentFormDialogProps) {
  const [formData, setFormData] = useState({
    classId: "",
    className: "",
    subject: "",
    title: "",
    description: "",
    dueDate: "",
    points: 100,
    status: "pending"
  });

  useEffect(() => {
    if (assignment && mode === "edit") {
      setFormData({
        classId: assignment.classId || "",
        className: assignment.className || "",
        subject: assignment.subject || "",
        title: assignment.title || "",
        description: assignment.description || "",
        dueDate: assignment.dueDate || "",
        points: assignment.points || 100,
        status: assignment.status || "pending"
      });
    } else {
      setFormData({
        classId: "",
        className: "",
        subject: "",
        title: "",
        description: "",
        dueDate: "",
        points: 100,
        status: "pending"
      });
    }
  }, [assignment, mode, open]);

  const handleClassChange = (classId: string) => {
    const selectedClass = CLASSES.find(c => c.id === classId);
    if (selectedClass) {
      setFormData({
        ...formData,
        classId,
        className: selectedClass.name,
        subject: selectedClass.name.includes('Math') ? 'Mathematics' :
                 selectedClass.name.includes('History') ? 'History' :
                 selectedClass.name.includes('Physics') ? 'Physics' :
                 selectedClass.name.includes('Literature') ? 'English' : 'Other'
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate || !formData.classId) return;

    const assignmentData = {
      ...assignment,
      ...formData,
      id: assignment?.id || `a-${Date.now()}`
    };

    onSave(assignmentData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Assignment" : "Edit Assignment"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new assignment for your class" : "Update assignment details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class">Class *</Label>
            <Select value={formData.classId} onValueChange={handleClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {CLASSES.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Chapter 5 Essay"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the assignment details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                placeholder="100"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 100 })}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {mode === "create" ? "Create Assignment" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
