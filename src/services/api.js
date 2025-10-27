
const getApiBaseUrl = () => {

  if (window.location.hostname.includes('vercel.app')) {
    return 'https://task-project-backend-35fp.onrender.com/api';
  }
  
 
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080/api';
  }
  

  return 'https://task-project-backend-35fp.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HTTP Error ${response.status}:`, errorText);
    throw new Error(`Error ${response.status}: ${errorText || 'Request failed'}`);
  }

  if (response.status === 204) {
    return null;
  }
  
  return await response.json();
};

export const taskService = {
  // Básicos
  getAllTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: getDefaultHeaders(),
    });
    return await handleResponse(response);
  },

  createTask: async (task) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(task),
    });
    return await handleResponse(response);
  },

  updateTask: async (id, task) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return await handleResponse(response);
  },

  deleteTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    return response.ok;
  },

  // Nuevos métodos
  toggleTaskCompletion: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    return await handleResponse(response);
  },

  getTasksByPriority: async (priority) => {
    const response = await fetch(`${API_BASE_URL}/tasks/priority/${priority}`);
    return await handleResponse(response);
  },

  getTasksByDateRange: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/tasks/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return await handleResponse(response);
  },

  getOverdueTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/overdue`);
    return await handleResponse(response);
  },

  getUpcomingTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/upcoming`);
    return await handleResponse(response);
  },

  searchTasks: async (keyword) => {
    const response = await fetch(`${API_BASE_URL}/tasks/search?keyword=${encodeURIComponent(keyword)}`);
    return await handleResponse(response);
  }
};
