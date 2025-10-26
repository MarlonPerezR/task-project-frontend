const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:8080/api' 
  : 'https://task-project-backend-daz2.onrender.com/api';

export const taskService = {
  // Básicos
  getAllTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    return await response.json();
  },

  createTask: async (task) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return await response.json();
  },

  updateTask: async (id, task) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return await response.json();
  },

  deleteTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  },

  // Nuevos métodos
  toggleTaskCompletion: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    return await response.json();
  },

  getTasksByPriority: async (priority) => {
    const response = await fetch(`${API_BASE_URL}/tasks/priority/${priority}`);
    return await response.json();
  },

  getTasksByDateRange: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/tasks/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return await response.json();
  },

  getOverdueTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/overdue`);
    return await response.json();
  },

  getUpcomingTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/upcoming`);
    return await response.json();
  },

  searchTasks: async (keyword) => {
    const response = await fetch(`${API_BASE_URL}/tasks/search?keyword=${keyword}`);
    return await response.json();
  }
};