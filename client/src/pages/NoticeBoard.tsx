import { useState, useEffect } from "react";
import { Role } from "@/lib/mockData";
import { noticesApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Plus, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import NoticeFormDialog from "@/components/teacher/NoticeFormDialog";
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

interface NoticeBoardProps {
  role: Role;
}

export default function NoticeBoard({ role }: NoticeBoardProps) {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch notices from API on mount
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await noticesApi.getAll();
        setNotices(data);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const sortedNotices = [...notices].sort((a, b) => {
    const priority = { urgent: 3, important: 2, normal: 1 };
    return priority[b.status as keyof typeof priority] - priority[a.status as keyof typeof priority];
  });

  const handleCreateNotice = () => {
    setFormMode("create");
    setEditingNotice(null);
    setIsFormOpen(true);
  };

  const handleEditNotice = (notice: any) => {
    setFormMode("edit");
    setEditingNotice(notice);
    setIsFormOpen(true);
  };

  const handleSaveNotice = async (noticeData: any) => {
    try {
      if (formMode === "create") {
        const newNotice = await noticesApi.create(noticeData);
        setNotices([...notices, newNotice]);
      } else {
        const updatedNotice = await noticesApi.update(noticeData.id, noticeData);
        setNotices(notices.map(n =>
          n.id === noticeData.id ? updatedNotice : n
        ));
      }
    } catch (error) {
      console.error("Failed to save notice:", error);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      await noticesApi.delete(id);
      setNotices(notices.filter(n => n.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete notice:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Notice Board
          </h1>
          <p className="text-muted-foreground mt-1">
            {role === 'teacher'
              ? "Post and manage important notices"
              : "Important notices and system updates"}
          </p>
        </div>
        {role === 'teacher' && (
          <Button onClick={handleCreateNotice}>
            <Plus className="w-4 h-4 mr-2" />
            Post Notice
          </Button>
        )}
      </div>

      {sortedNotices.some(n => n.status === 'urgent') && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Urgent Notices</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You have {sortedNotices.filter(n => n.status === 'urgent').length} urgent notice{sortedNotices.filter(n => n.status === 'urgent').length !== 1 ? 's' : ''} that require immediate attention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sortedNotices.map((notice) => (
          <Card
            key={notice.id}
            className={`border-l-4 ${
              notice.status === 'urgent'
                ? 'border-l-destructive'
                : notice.status === 'important'
                ? 'border-l-orange-500'
                : 'border-l-primary'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base">{notice.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      notice.status === 'urgent'
                        ? 'destructive'
                        : notice.status === 'important'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="text-xs h-5 capitalize"
                  >
                    {notice.status}
                  </Badge>
                  {role === 'teacher' && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditNotice(notice)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirm(notice.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90">{notice.content}</p>
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(notice.date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedNotices.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No notices at this time</p>
            </div>
          </CardContent>
        </Card>
      )}

      <NoticeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveNotice}
        notice={editingNotice}
        mode={formMode}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the notice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDeleteNotice(deleteConfirm)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
