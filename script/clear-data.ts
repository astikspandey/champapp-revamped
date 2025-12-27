import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emptyData = {
  "users": {
    "student": {
      "id": "s1",
      "name": "Student User",
      "role": "student",
      "avatar": "",
      "email": "student@school.edu"
    },
    "teacher": {
      "id": "t1",
      "name": "Teacher User",
      "role": "teacher",
      "avatar": "",
      "email": "teacher@school.edu"
    }
  },
  "classes": [],
  "assignments": [],
  "announcements": [],
  "newsletters": [],
  "notices": [],
  "tasks": [],
  "submissions": [],
  "messages": []
};

async function clearData() {
  const dataPath = path.join(__dirname, "../server/maindata.json");

  try {
    await fs.writeFile(dataPath, JSON.stringify(emptyData, null, 2), "utf-8");
    console.log("✅ Data cleared successfully! All collections are now empty.");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    process.exit(1);
  }
}

clearData();
