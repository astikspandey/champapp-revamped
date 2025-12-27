import { useState, useEffect } from "react";
import { tasksApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Plus, X, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TaskCreationDialog from "./TaskCreationDialog";

interface TaskListProps {
  userId: string;
}

function TaskList({ userId }: TaskListProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch tasks from API on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await tasksApi.getAll(userId);
        setTasks(data.sort((a: any, b: any) => a.order - b.order));
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [userId]);

  const handleDragStart = (id: string) => {
    setDraggedTask(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedTask || draggedTask === targetId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTask);
    const targetIndex = tasks.findIndex(t => t.id === targetId);

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, movedTask);

    const reorderedTasks = newTasks.map((task, index) => ({ ...task, order: index + 1 }));
    setTasks(reorderedTasks);
    setDraggedTask(null);

    // Save reordered tasks to API
    try {
      await tasksApi.bulkUpdate(reorderedTasks);
    } catch (error) {
      console.error("Failed to reorder tasks:", error);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    setTasks(tasks.map(t => t.id === id ? updatedTask : t));

    try {
      await tasksApi.update(id, updatedTask);
    } catch (error) {
      console.error("Failed to toggle task:", error);
      // Revert on error
      setTasks(tasks);
    }
  };

  const deleteTask = async (id: string) => {
    const originalTasks = [...tasks];
    setTasks(tasks.filter(task => task.id !== id));

    try {
      await tasksApi.delete(id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Revert on error
      setTasks(originalTasks);
    }
  };

  const handleTaskCreated = async (newTask: any) => {
    const taskWithUserId = { ...newTask, userId };
    const updatedTasks = [...tasks, taskWithUserId].map((task, index) => ({ ...task, order: index + 1 }));
    setTasks(updatedTasks);

    try {
      await tasksApi.create(taskWithUserId);
    } catch (error) {
      console.error("Failed to create task:", error);
      // Revert on error
      setTasks(tasks);
    }
  };

  const highPriorityTasks = tasks.filter(t => t.priority === "high" && !t.completed);
  const incompleteTasks = tasks.filter(t => !t.completed);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Loading tasks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">My Tasks</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {incompleteTasks.length} task{incompleteTasks.length !== 1 ? 's' : ''} remaining
            </p>
          </div>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {highPriorityTasks.length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-500 mt-0.5 shrink-0" />
              <div className="text-sm text-orange-800 dark:text-orange-300">
                <p className="font-medium">You have {highPriorityTasks.length} high priority task(s)</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No tasks yet. Click "Add Task" to create one!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(task.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors cursor-move group"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs h-5 font-normal">
                        {task.subject}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={task.priority === "high" ? "destructive" : "outline"}
                    className="text-xs h-5 shrink-0 capitalize"
                  >
                    {task.priority}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteTask(task.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <TaskCreationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTaskCreated={handleTaskCreated}
      />
    </>
  );
}

export default TaskList;
