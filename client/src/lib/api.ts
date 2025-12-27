// API utility functions for making backend requests

const API_BASE = '/api';

export interface Assignment {
  id: string;
  classId: string;
  className: string;
  subject: string;
  title: string;
  dueDate: string;
  status: string;
  grade: number | null;
  points: number;
  description: string;
}

export interface Announcement {
  id: string;
  author: string;
  classId: string;
  className: string;
  title: string;
  content: string;
  date: string;
  priority: string;
}

export interface Newsletter {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  status: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  dueDate: string;
  priority: string;
  subject: string;
  completed: boolean;
  order: number;
  fromAssignment?: boolean;
  assignmentId?: string;
  description?: string;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  teacher: string;
  schedule: string;
  students: number;
  color: string;
  progress: number;
  nextClass: string;
  enrolledStudents: string[];
}

// Generic API functions
async function apiCall(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Classes API
export const classesApi = {
  getAll: () => apiCall(`${API_BASE}/classes`),
  create: (data: Class) => apiCall(`${API_BASE}/classes`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Class) => apiCall(`${API_BASE}/classes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`${API_BASE}/classes/${id}`, {
    method: 'DELETE',
  }),
};

// Assignments API
export const assignmentsApi = {
  getAll: () => apiCall(`${API_BASE}/assignments`),
  create: (data: Assignment) => apiCall(`${API_BASE}/assignments`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Assignment) => apiCall(`${API_BASE}/assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`${API_BASE}/assignments/${id}`, {
    method: 'DELETE',
  }),
};

// Announcements API
export const announcementsApi = {
  getAll: () => apiCall(`${API_BASE}/announcements`),
  create: (data: Announcement) => apiCall(`${API_BASE}/announcements`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Announcement) => apiCall(`${API_BASE}/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`${API_BASE}/announcements/${id}`, {
    method: 'DELETE',
  }),
};

// Newsletters API
export const newslettersApi = {
  getAll: () => apiCall(`${API_BASE}/newsletters`),
  create: (data: Newsletter) => apiCall(`${API_BASE}/newsletters`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Newsletter) => apiCall(`${API_BASE}/newsletters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`${API_BASE}/newsletters/${id}`, {
    method: 'DELETE',
  }),
};

// Notices API
export const noticesApi = {
  getAll: () => apiCall(`${API_BASE}/notices`),
  create: (data: Notice) => apiCall(`${API_BASE}/notices`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Notice) => apiCall(`${API_BASE}/notices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`${API_BASE}/notices/${id}`, {
    method: 'DELETE',
  }),
};

// Tasks API
export const tasksApi = {
  getAll: (userId?: string) => apiCall(`${API_BASE}/tasks${userId ? `?userId=${userId}` : ''}`),
  create: (data: Task) => apiCall(`${API_BASE}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Task) => apiCall(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  }),
  bulkUpdate: (tasks: Task[]) => apiCall(`${API_BASE}/tasks`, {
    method: 'PUT',
    body: JSON.stringify({ tasks }),
  }),
};

// Get all data
export const getAllData = () => apiCall(`${API_BASE}/data`);
