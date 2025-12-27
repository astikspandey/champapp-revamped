import { useState, useEffect } from "react";
import { Role } from "@/lib/mockData";
import { newslettersApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Plus, Pencil, Trash2 } from "lucide-react";
import NewsletterFormDialog from "@/components/teacher/NewsletterFormDialog";
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

interface NewsletterProps {
  role: Role;
}

export default function Newsletter({ role }: NewsletterProps) {
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<any>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch newsletters from API on mount
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setLoading(true);
        const data = await newslettersApi.getAll();
        setNewsletters(data);
      } catch (error) {
        console.error("Failed to fetch newsletters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletters();
  }, []);

  const categories = ["all", "Campus News", "Achievements", "Professional Development"];

  const filteredNewsletters = activeCategory === "all"
    ? newsletters
    : newsletters.filter(n => n.category === activeCategory);

  const handleCreateNewsletter = () => {
    setFormMode("create");
    setEditingNewsletter(null);
    setIsFormOpen(true);
  };

  const handleEditNewsletter = (newsletter: any) => {
    setFormMode("edit");
    setEditingNewsletter(newsletter);
    setIsFormOpen(true);
  };

  const handleSaveNewsletter = async (newsletterData: any) => {
    try {
      if (formMode === "create") {
        const newNewsletter = await newslettersApi.create(newsletterData);
        setNewsletters([...newsletters, newNewsletter]);
      } else {
        const updatedNewsletter = await newslettersApi.update(newsletterData.id, newsletterData);
        setNewsletters(newsletters.map(n =>
          n.id === newsletterData.id ? updatedNewsletter : n
        ));
      }
    } catch (error) {
      console.error("Failed to save newsletter:", error);
    }
  };

  const handleDeleteNewsletter = async (id: string) => {
    try {
      await newslettersApi.delete(id);
      setNewsletters(newsletters.filter(n => n.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete newsletter:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading newsletters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="w-8 h-8" />
            Newsletter
          </h1>
          <p className="text-muted-foreground mt-1">
            {role === 'teacher'
              ? "Create and manage school-wide newsletters"
              : "School-wide newsletters and updates"}
          </p>
        </div>
        {role === 'teacher' && (
          <Button onClick={handleCreateNewsletter}>
            <Plus className="w-4 h-4 mr-2" />
            Create Newsletter
          </Button>
        )}
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4 mt-0">
            {(category === "all" ? newsletters : filteredNewsletters).map((newsletter) => (
              <Card key={newsletter.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base">{newsletter.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs h-5 mt-2">
                        {newsletter.category}
                      </Badge>
                    </div>
                    {role === 'teacher' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditNewsletter(newsletter)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirm(newsletter.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/90">{newsletter.content}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(newsletter.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
            {(category === "all" ? newsletters : filteredNewsletters).length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No newsletters found in this category</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <NewsletterFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveNewsletter}
        newsletter={editingNewsletter}
        mode={formMode}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Newsletter?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the newsletter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDeleteNewsletter(deleteConfirm)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
