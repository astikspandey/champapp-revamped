import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (classData: any) => void;
  classData?: any;
  mode: "create" | "edit";
}

const colors = [
  "hsl(221, 83%, 53%)", // Blue
  "hsl(25, 95%, 58%)",  // Orange
  "hsl(160, 60%, 45%)", // Green
  "hsl(340, 75%, 55%)", // Pink
  "hsl(280, 75%, 55%)", // Purple
  "hsl(45, 93%, 58%)",  // Yellow
];

export default function ClassFormDialog({
  open,
  onOpenChange,
  onSave,
  classData,
  mode
}: ClassFormDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    teacher: "",
    schedule: "",
    students: 0,
    color: colors[0],
    progress: 0,
    nextClass: "",
    enrolledStudents: []
  });

  useEffect(() => {
    if (mode === "edit" && classData) {
      setFormData(classData);
    } else if (mode === "create") {
      setFormData({
        id: `c${Date.now()}`,
        name: "",
        code: "",
        teacher: "",
        schedule: "",
        students: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        progress: 0,
        nextClass: "",
        enrolledStudents: []
      });
    }
  }, [mode, classData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Class" : "Edit Class"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Advanced Mathematics"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Class Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., MATH-301"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher Name</Label>
            <Input
              id="teacher"
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              placeholder="e.g., Dr. Smith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="e.g., Mon, Wed 10:00 AM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextClass">Next Class</Label>
            <Input
              id="nextClass"
              value={formData.nextClass}
              onChange={(e) => setFormData({ ...formData, nextClass: e.target.value })}
              placeholder="e.g., Monday, 10:00 AM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Class Color</Label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color ? 'border-primary scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Class" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
