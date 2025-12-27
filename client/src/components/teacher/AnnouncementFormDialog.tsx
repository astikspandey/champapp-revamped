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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CLASSES } from "@/lib/mockData";

interface AnnouncementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (announcement: any) => void;
  announcement?: any;
  mode: "create" | "edit";
}

export default function AnnouncementFormDialog({
  open,
  onOpenChange,
  onSave,
  announcement,
  mode
}: AnnouncementFormDialogProps) {
  const [formData, setFormData] = useState({
    classId: "",
    className: "",
    title: "",
    content: "",
    priority: "normal",
    author: "Dr. Sarah Chen"
  });

  useEffect(() => {
    if (announcement && mode === "edit") {
      setFormData({
        classId: announcement.classId || "",
        className: announcement.className || "",
        title: announcement.title || "",
        content: announcement.content || "",
        priority: announcement.priority || "normal",
        author: announcement.author || "Dr. Sarah Chen"
      });
    } else {
      setFormData({
        classId: "",
        className: "",
        title: "",
        content: "",
        priority: "normal",
        author: "Dr. Sarah Chen"
      });
    }
  }, [announcement, mode, open]);

  const handleClassChange = (classId: string) => {
    const selectedClass = CLASSES.find(c => c.id === classId);
    if (selectedClass) {
      setFormData({
        ...formData,
        classId,
        className: selectedClass.name
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || !formData.classId) return;

    const announcementData = {
      ...announcement,
      ...formData,
      id: announcement?.id || `an-${Date.now()}`,
      date: announcement?.date || "Just now"
    };

    onSave(announcementData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Announcement" : "Edit Announcement"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Post a new announcement to your class" : "Update announcement details"}
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
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Reminder about midterm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message *</Label>
            <Textarea
              id="content"
              placeholder="Type your announcement here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="font-normal cursor-pointer">
                  Normal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal cursor-pointer">
                  High Priority
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {mode === "create" ? "Post Announcement" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
