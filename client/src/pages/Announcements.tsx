import { useState, useEffect } from "react";
import { CLASSES, Role } from "@/lib/mockData";
import { announcementsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, AlertCircle, Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnnouncementFormDialog from "@/components/teacher/AnnouncementFormDialog";
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

interface AnnouncementsProps {
  role: Role;
}

export default function Announcements({ role }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch announcements from API on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await announcementsApi.getAll();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = filterClass === "all"
    ? announcements
    : announcements.filter(a => a.classId === filterClass);

  const handleCreateAnnouncement = () => {
    setFormMode("create");
    setEditingAnnouncement(null);
    setIsFormOpen(true);
  };

  const handleEditAnnouncement = (announcement: any) => {
    setFormMode("edit");
    setEditingAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleSaveAnnouncement = async (announcementData: any) => {
    try {
      if (formMode === "create") {
        const newAnnouncement = await announcementsApi.create(announcementData);
        setAnnouncements([...announcements, newAnnouncement]);
      } else {
        const updatedAnnouncement = await announcementsApi.update(announcementData.id, announcementData);
        setAnnouncements(announcements.map(a =>
          a.id === announcementData.id ? updatedAnnouncement : a
        ));
      }
    } catch (error) {
      console.error("Failed to save announcement:", error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await announcementsApi.delete(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Megaphone className="w-8 h-8" />
            Announcements
          </h1>
          <p className="text-muted-foreground mt-1">
            {role === 'teacher'
              ? "Create and manage class announcements"
              : "Stay updated with the latest class announcements"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {CLASSES.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {role === 'teacher' && (
            <Button onClick={handleCreateAnnouncement}>
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          )}
        </div>
      </div>

      {filteredAnnouncements.some(a => a.priority === 'high') && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">High Priority Announcements</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You have {filteredAnnouncements.filter(a => a.priority === 'high').length} high priority announcement{filteredAnnouncements.filter(a => a.priority === 'high').length !== 1 ? 's' : ''} that require your attention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card
            key={announcement.id}
            className={`hover:shadow-md transition-shadow ${
              announcement.priority === 'high' ? 'border-l-4 border-l-destructive' : ''
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base">{announcement.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {announcement.author} • {announcement.className}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {announcement.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs h-5">
                      High Priority
                    </Badge>
                  )}
                  {role === 'teacher' && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditAnnouncement(announcement)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirm(announcement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90">{announcement.content}</p>
              <p className="text-xs text-muted-foreground mt-3">{announcement.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Megaphone className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No announcements found</p>
            </div>
          </CardContent>
        </Card>
      )}

      <AnnouncementFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveAnnouncement}
        announcement={editingAnnouncement}
        mode={formMode}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the announcement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDeleteAnnouncement(deleteConfirm)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
