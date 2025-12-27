import { useState } from "react";
import { TASKS as initialTasks } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Plus, X, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedTask(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedTask || draggedTask === targetId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTask);
    const targetIndex = tasks.findIndex(t => t.id === targetId);

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, movedTask);

    setTasks(newTasks.map((task, index) => ({ ...task, order: index + 1 })));
    setDraggedTask(null);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const highPriorityTasks = tasks.filter(t => t.priority === "high" && !t.completed);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">My Tasks</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {tasks.filter(t => !t.completed).length} tasks remaining
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {highPriorityTasks.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
            <div className="text-sm text-orange-800">
              <p className="font-medium">You have {highPriorityTasks.length} high priority task(s)</p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {tasks.map((task) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskList;
