import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { taskService } from "./services/api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilter from "./components/TaskFilter";
import CalendarView from "./components/CalendarView";
import Dashboard from "./components/Dashboard";
import "./App.css";

/**
 * Componente modal extraído fuera de App
 */
function DateModal({
  show,
  selectedDate,
  tasks,
  onClose,
  onCreateTask,
  onToggleComplete,
  onViewList,
  setFilter,
}) {
  if (!show || !selectedDate) {
    return null; // ✅ Evita condición negada (S7735)
  }

const getTasksForSelectedDate = () => {
  if (!selectedDate) return [];
  
  const dateString = selectedDate.toISOString().split('T')[0];
  return tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const taskDateString = taskDate.toISOString().split('T')[0];
    return taskDateString === dateString;
  });
};

  const dateTasks = getTasksForSelectedDate();
  const dateString = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "LOW":
        return "#48bb78";
      case "MEDIUM":
        return "#ed8936";
      case "HIGH":
        return "#f56565";
      default:
        return "#e53e3e";
    }
  };

  return (
    <div
      className="modal-overlay"
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Enter" && onClose()}
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={`Tareas para ${dateString}`}
      >
        <div className="modal-header">
          <h3>📅 Tareas para {dateString}</h3>
          <button
            type="button"
            className="modal-close"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {dateTasks.length === 0 ? (
            <div className="no-tasks-modal">
              <span className="empty-icon">📝</span>
              <p>No hay tareas para esta fecha</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  onClose();
                  onCreateTask();
                }}
              >
                ➕ Crear Tarea para esta fecha
              </button>
            </div>
          ) : (
            <div className="date-tasks-list">
              {dateTasks.map((task) => (
                <div
                  key={task.id}
                  className={`date-task-item ${
                    task.completed ? "completed" : ""
                  }`}
                >
                  <div className="date-task-header">
                    <h4>{task.title}</h4>
                    <span
                      className={`status-badge ${
                        task.completed ? "completed" : "pending"
                      }`}
                    >
                      {task.completed ? "✅ Completada" : "⏳ Pendiente"}
                    </span>
                  </div>

                  {task.description && (
                    <p className="date-task-description">{task.description}</p>
                  )}

                  <div className="date-task-info">
                    <span className="priority-info">
                      Prioridad:
                      <span
                        className="priority-dot"
                        style={{
                          backgroundColor: getPriorityColor(task.priority),
                        }}
                      ></span>
                      {task.priority}
                    </span>
                  </div>

                  <div className="date-task-actions">
                    <button
                      type="button"
                      onClick={() => onToggleComplete(task.id)}
                      className={`btn-action-small ${
                        task.completed ? "btn-undo" : "btn-complete"
                      }`}
                    >
                      {task.completed ? "↶ Deshacer" : "✓ Completar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onViewList();
                      }}
                      className="btn-action-small btn-view"
                    >
                      👀 Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          {dateTasks.length > 0 && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onClose();
                onViewList();
                setFilter("all");
              }}
            >
              📋 Ver en lista completa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** ✅ Validación de props (elimina javascript:S6774) */
DateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      priority: PropTypes.oneOf(["LOW", "MEDIUM", "HIGH"]),
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateTask: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onViewList: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await taskService.getAllTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error cargando tareas:", error);
      alert(
        "Error al cargar las tareas. Verifica que el backend esté ejecutándose."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (newTask) => {
    const createdTask = await taskService.createTask(newTask);
    await loadTasks();
    setShowTaskForm(false);
    return createdTask;
  };

  const handleUpdateTask = async (id, updatedTask) => {
    await taskService.updateTask(id, updatedTask);
    await loadTasks();
  };

  const handleDeleteTask = async (id) => {
    await taskService.deleteTask(id);
    await loadTasks();
  };

  const handleToggleComplete = async (id) => {
    await taskService.toggleTaskCompletion(id);
    await loadTasks();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDateModal(true);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setShowFilters(false);
  };

  const toggleTaskForm = () => {
    setShowTaskForm((prev) => !prev);
  };

  const handleCancelForm = () => {
    setShowTaskForm(false);
  };

  const filteredTasks = tasks.filter((task) => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dueDate = new Date(task.dueDate);

    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filter === "overdue") return !task.completed && dueDate < new Date();
    if (filter === "upcoming") return !task.completed && dueDate <= nextWeek;
    return true;
  });

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Task Manager Pro</h1>
          <p>Gestiona tus tareas de forma profesional</p>
        </div>
      </header>

      <main className="app-main">
        <div className="app-sidebar">
          <div className="app-nav">
            <button
              type="button"
              className={`nav-btn ${view === "dashboard" ? "active" : ""}`}
              onClick={() => setView("dashboard")}
            >
              📊 Dashboard
            </button>
            <button
              type="button"
              className={`nav-btn ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
            >
              📋 Lista
            </button>
            <button
              type="button"
              className={`nav-btn ${view === "calendar" ? "active" : ""}`}
              onClick={() => setView("calendar")}
            >
              📅 Calendario
            </button>
          </div>

          {view === "list" && (
            <div className="sidebar-block">
              <div className="filter-section">
                <div className="filter-header">
                  <h3>🔍 Filtrar Tareas</h3>
                  <button
                    type="button"
                    className={`btn-filter-toggle ${
                      showFilters ? "active" : ""
                    }`}
                    onClick={() => setShowFilters((prev) => !prev)}
                  >
                    {showFilters ? "▲" : "▼"}
                  </button>
                </div>

                {showFilters && (
                  <div className="filters-content">
                    <TaskFilter
                      filter={filter}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="sidebar-block">
            {showTaskForm ? (
              <TaskForm
                onTaskCreated={handleCreateTask}
                onCancel={handleCancelForm}
              />
            ) : (
              <button
                type="button"
                className="btn-create-task"
                onClick={toggleTaskForm}
              >
                ➕ Crear Tarea
              </button>
            )}
          </div>
        </div>

        <div className="app-content">
          {loading && <div className="loading">Cargando tareas...</div>}
          {view === "dashboard" && <Dashboard tasks={tasks} />}
          {view === "list" && (
            <TaskList
              tasks={filteredTasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          )}
          {view === "calendar" && (
            <CalendarView
              onDateSelect={handleDateSelect}
              tasks={tasks} // ✅ Agrega esta prop
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          🚀 Task Manager Pro - Spring Boot + React | Desarrollado por Marlon
          Pérez
        </p>
      </footer>

      <DateModal
        show={showDateModal}
        selectedDate={selectedDate}
        tasks={tasks}
        onClose={() => setShowDateModal(false)}
        onCreateTask={() => setShowTaskForm(true)}
        onToggleComplete={handleToggleComplete}
        onViewList={() => setView("list")}
        setFilter={setFilter}
      />
    </div>
  );
}

export default App;
