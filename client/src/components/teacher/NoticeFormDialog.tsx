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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface NoticeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (notice: any) => void;
  notice?: any;
  mode: "create" | "edit";
}

export default function NoticeFormDialog({
  open,
  onOpenChange,
  onSave,
  notice,
  mode
}: NoticeFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "normal"
  });

  useEffect(() => {
    if (notice && mode === "edit") {
      setFormData({
        title: notice.title || "",
        content: notice.content || "",
        status: notice.status || "normal"
      });
    } else {
      setFormData({
        title: "",
        content: "",
        status: "normal"
      });
    }
  }, [notice, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const noticeData = {
      ...notice,
      ...formData,
      id: notice?.id || `n-${Date.now()}`,
      date: notice?.date || new Date().toISOString().split('T')[0]
    };

    onSave(noticeData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Post Notice" : "Edit Notice"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new notice for the notice board" : "Update notice details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., System Maintenance"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Describe the notice details..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Priority Status</Label>
            <RadioGroup value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="font-normal cursor-pointer">
                  Normal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="important" id="important" />
                <Label htmlFor="important" className="font-normal cursor-pointer">
                  Important
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="font-normal cursor-pointer">
                  Urgent
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {mode === "create" ? "Post Notice" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
