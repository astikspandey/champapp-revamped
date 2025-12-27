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

interface NewsletterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newsletter: any) => void;
  newsletter?: any;
  mode: "create" | "edit";
}

export default function NewsletterFormDialog({
  open,
  onOpenChange,
  onSave,
  newsletter,
  mode
}: NewsletterFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Campus News"
  });

  useEffect(() => {
    if (newsletter && mode === "edit") {
      setFormData({
        title: newsletter.title || "",
        content: newsletter.content || "",
        category: newsletter.category || "Campus News"
      });
    } else {
      setFormData({
        title: "",
        content: "",
        category: "Campus News"
      });
    }
  }, [newsletter, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newsletterData = {
      ...newsletter,
      ...formData,
      id: newsletter?.id || `nl-${Date.now()}`,
      date: newsletter?.date || new Date().toISOString().split('T')[0]
    };

    onSave(newsletterData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Newsletter" : "Edit Newsletter"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new school-wide newsletter" : "Update newsletter details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Weekly Campus Digest"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Campus News">Campus News</SelectItem>
                <SelectItem value="Achievements">Achievements</SelectItem>
                <SelectItem value="Professional Development">Professional Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Write your newsletter content..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {mode === "create" ? "Publish Newsletter" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
