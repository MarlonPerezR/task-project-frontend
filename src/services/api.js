// ELIMINA esta línea:
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://task-project-backend-35fp.onrender.com/api';

// Y deja solo esta función:
const getApiBaseUrl = () => {
  // Usar variable de entorno si existe
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Para localhost usar backend local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080/api';
  }
  
  // Por defecto, usar Render
  return 'https://task-project-backend-35fp.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl(); // ✅ Solo UNA declaración

console.log('API Base URL:', API_BASE_URL);

// Headers comunes para todas las requests
const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
});

// Manejo centralizado de errores HTTP
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HTTP Error ${response.status}:`, errorText);
    throw new Error(`Error ${response.status}: ${errorText || 'Request failed'}`);
  }
  
  // Para respuestas sin contenido (como DELETE)
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
      headers: getDefaultHeaders(),
      body: JSON.stringify(task),
    });
    return await handleResponse(response);
  },

  deleteTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getDefaultHeaders(),
    });
    return await handleResponse(response); // Simplificado
  },

  // Nuevos métodos
  toggleTaskCompletion: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
      headers: getDefaultHeaders(),
    });
    return await handleResponse(response);
  },

  getTasksByPriority: async (priority) => {
    const response = await fetch(`${API_BASE_URL}/tasks/priority/${priority}`, {
      headers: getDefaultHeaders(),
    });
    return await handleResponse(response);
  },

  getTasksByDateRange: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/tasks/date-range?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: getDefaultHeaders(),
      }
    );
    return await handleResponse(response);
  },

  getOverdueTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/overdue`, {
      headers: getDefaultHeaders(),
    });
    return await handleResponse(response);
  },

  getUpcomingTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/upcoming`, {
      headers: getDefaultHeaders(),
    });
    return await handleResponse(response);
  },

  searchTasks: async (keyword) => {
    const response = await fetch(`${API_BASE_URL}/tasks/search?keyword=${encodeURIComponent(keyword)}`, {
      headers: getDefaultHeaders(),
    });
    return await handleResponse(response);
  }
};