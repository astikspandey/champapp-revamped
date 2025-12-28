import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { decryptWalkerAuthData, generateToken } from "./auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "maindata.json");

// Helper function to read data
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file:", error);
    throw error;
  }
}

// Helper function to write data
async function writeData(data: any) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing data file:", error);
    throw error;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ===== AUTHENTICATION ROUTES =====

  // OAuth callback from WalkerAuth
  app.post("/oauth/callback", async (req, res) => {
    try {
      const { encrypted, iv, siteId } = req.body;

      if (!encrypted || !iv) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      const secretKey = process.env.WALKERAUTH_SECRET_KEY;
      if (!secretKey) {
        console.error("WALKERAUTH_SECRET_KEY not set in environment");
        return res.status(500).json({ success: false, error: "Server configuration error" });
      }

      // Decrypt user data
      const userData = decryptWalkerAuthData(encrypted, iv, secretKey);

      // Generate session token
      const token = generateToken();

      // Store user data in session
      req.session.userId = userData.postid;
      req.session.email = userData.email;
      req.session.username = userData.username;
      req.session.profilePictureUrl = userData.profilePictureUrl;

      // For now, default to student role - can be enhanced later
      req.session.role = "student";

      // Save session and return token
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      res.json({ success: true, token });
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.status(500).json({ success: false, error: "Authentication failed" });
    }
  });

  // Auth success endpoint - redirects to app with session
  app.get("/auth/success", async (req, res) => {
    const { token } = req.query;

    if (!token || !req.session.userId) {
      return res.redirect("/login?error=authentication_failed");
    }

    // Token verified, session is set, redirect to dashboard
    res.redirect("/dashboard");
  });

  // Check auth status
  app.get("/api/auth/status", (req, res) => {
    if (req.session.userId) {
      res.json({
        authenticated: true,
        user: {
          id: req.session.userId,
          email: req.session.email,
          username: req.session.username,
          profilePictureUrl: req.session.profilePictureUrl,
          role: req.session.role,
        },
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  // Get all data
  app.get("/api/data", async (req, res) => {
    try {
      const data = await readData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  // ===== CLASSES =====
  app.get("/api/classes", async (req, res) => {
    try {
      const data = await readData();
      res.json(data.classes || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to read classes" });
    }
  });

  app.post("/api/classes", async (req, res) => {
    try {
      const data = await readData();
      const newClass = req.body;
      data.classes = data.classes || [];
      data.classes.push(newClass);
      await writeData(data);
      res.json(newClass);
    } catch (error) {
      res.status(500).json({ error: "Failed to create class" });
    }
  });

  app.put("/api/classes/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      const updatedClass = req.body;
      const index = data.classes.findIndex((c: any) => c.id === id);
      if (index !== -1) {
        data.classes[index] = updatedClass;
        await writeData(data);
        res.json(updatedClass);
      } else {
        res.status(404).json({ error: "Class not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update class" });
    }
  });

  app.delete("/api/classes/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      data.classes = data.classes.filter((c: any) => c.id !== id);
      await writeData(data);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete class" });
    }
  });

  // ===== ASSIGNMENTS =====
  app.get("/api/assignments", async (req, res) => {
    try {
      const data = await readData();
      res.json(data.assignments || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to read assignments" });
    }
  });

  app.post("/api/assignments", async (req, res) => {
    try {
      const data = await readData();
      const newAssignment = req.body;
      data.assignments = data.assignments || [];
      data.assignments.push(newAssignment);
      await writeData(data);
      res.json(newAssignment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });

  app.put("/api/assignments/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      const updatedAssignment = req.body;
      const index = data.assignments.findIndex((a: any) => a.id === id);
      if (index !== -1) {
        data.assignments[index] = updatedAssignment;
        await writeData(data);
        res.json(updatedAssignment);
      } else {
        res.status(404).json({ error: "Assignment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update assignment" });
    }
  });

  app.delete("/api/assignments/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      data.assignments = data.assignments.filter((a: any) => a.id !== id);
      await writeData(data);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete assignment" });
    }
  });

  // ===== ANNOUNCEMENTS =====
  app.get("/api/announcements", async (req, res) => {
    try {
      const data = await readData();
      res.json(data.announcements || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to read announcements" });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const data = await readData();
      const newAnnouncement = req.body;
      data.announcements = data.announcements || [];
      data.announcements.push(newAnnouncement);
      await writeData(data);
      res.json(newAnnouncement);
    } catch (error) {
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });

  app.put("/api/announcements/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      const updatedAnnouncement = req.body;
      const index = data.announcements.findIndex((a: any) => a.id === id);
      if (index !== -1) {
        data.announcements[index] = updatedAnnouncement;
        await writeData(data);
        res.json(updatedAnnouncement);
      } else {
        res.status(404).json({ error: "Announcement not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      data.announcements = data.announcements.filter((a: any) => a.id !== id);
      await writeData(data);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  // ===== NEWSLETTERS =====
  app.get("/api/newsletters", async (req, res) => {
    try {
      const data = await readData();
      res.json(data.newsletters || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to read newsletters" });
    }
  });

  app.post("/api/newsletters", async (req, res) => {
    try {
      const data = await readData();
      const newNewsletter = req.body;
      data.newsletters = data.newsletters || [];
      data.newsletters.push(newNewsletter);
      await writeData(data);
      res.json(newNewsletter);
    } catch (error) {
      res.status(500).json({ error: "Failed to create newsletter" });
    }
  });

  app.put("/api/newsletters/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      const updatedNewsletter = req.body;
      const index = data.newsletters.findIndex((n: any) => n.id === id);
      if (index !== -1) {
        data.newsletters[index] = updatedNewsletter;
        await writeData(data);
        res.json(updatedNewsletter);
      } else {
        res.status(404).json({ error: "Newsletter not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update newsletter" });
    }
  });

  app.delete("/api/newsletters/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      data.newsletters = data.newsletters.filter((n: any) => n.id !== id);
      await writeData(data);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete newsletter" });
    }
  });

  // ===== NOTICES =====
  app.get("/api/notices", async (req, res) => {
    try {
      const data = await readData();
      res.json(data.notices || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to read notices" });
    }
  });

  app.post("/api/notices", async (req, res) => {
    try {
      const data = await readData();
      const newNotice = req.body;
      data.notices = data.notices || [];
      data.notices.push(newNotice);
      await writeData(data);
      res.json(newNotice);
    } catch (error) {
      res.status(500).json({ error: "Failed to create notice" });
    }
  });

  app.put("/api/notices/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      const updatedNotice = req.body;
      const index = data.notices.findIndex((n: any) => n.id === id);
      if (index !== -1) {
        data.notices[index] = updatedNotice;
        await writeData(data);
        res.json(updatedNotice);
      } else {
        res.status(404).json({ error: "Notice not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update notice" });
    }
  });

  app.delete("/api/notices/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      data.notices = data.notices.filter((n: any) => n.id !== id);
      await writeData(data);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete notice" });
    }
  });

  // ===== TASKS =====
  app.get("/api/tasks", async (req, res) => {
    try {
      const data = await readData();
      const { userId } = req.query;
      let tasks = data.tasks || [];
      if (userId) {
        tasks = tasks.filter((t: any) => t.userId === userId);
      }
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to read tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const data = await readData();
      const newTask = req.body;
      data.tasks = data.tasks || [];
      data.tasks.push(newTask);
      await writeData(data);
      res.json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      const updatedTask = req.body;
      const index = data.tasks.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        data.tasks[index] = updatedTask;
        await writeData(data);
        res.json(updatedTask);
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const data = await readData();
      const { id } = req.params;
      data.tasks = data.tasks.filter((t: any) => t.id !== id);
      await writeData(data);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // ===== BULK TASKS UPDATE (for reordering) =====
  app.put("/api/tasks", async (req, res) => {
    try {
      const data = await readData();
      const { tasks } = req.body;
      // Replace all tasks for a specific user
      const userTasks = tasks;
      const otherTasks = data.tasks.filter((t: any) =>
        !userTasks.some((ut: any) => ut.id === t.id)
      );
      data.tasks = [...otherTasks, ...userTasks];
      await writeData(data);
      res.json({ success: true, tasks: userTasks });
    } catch (error) {
      res.status(500).json({ error: "Failed to update tasks" });
    }
  });

  return httpServer;
}
