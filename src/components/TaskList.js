import React, { useState } from "react";
import TaskForm from "./TaskForm";
import PropTypes from "prop-types";

const TaskList = ({ tasks, onUpdateTask, onDeleteTask, onToggleComplete }) => {
  const [editingTask, setEditingTask] = useState(null);
  const priorities = {
    LOW: { label: "🔵 Baja", color: "#48bb78" },
    MEDIUM: { label: "🟡 Media", color: "#ed8936" },
    HIGH: { label: "🟠 Alta", color: "#f56565" },
    URGENT: { label: "🔴 Urgente", color: "#e53e3e" },
  };

  const isOverdue = (task) => {
    if (task.completed) return false;

    const now = new Date();
    const due = new Date(task.dueDate);

    console.log("Verificación vencimiento:", {
      tarea: task.title,
      ahora: now.toString(),
      vence: due.toString(),
      esVencida: due < now,
    });

    return due < now;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
    };

    const dateFormatted = date.toLocaleDateString("es-ES", options);
    const timeFormatted = date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dateFormatted} - ${timeFormatted}`;
  };

  const handleToggleComplete = async (task) => {
    await onToggleComplete(task.id);
  };

const handleDelete = async (taskId) => {
  // eslint-disable-next-line no-alert
  if (window.confirm("¿Estás seguro de eliminar esta tarea?")) { // ✅ confirm devuelve true/false
    await onDeleteTask(taskId);
  }
};

  const handleEdit = (task) => {
    const taskDate = new Date(task.dueDate);

    const dueDate = taskDate.toISOString().split("T")[0];
    const hours = taskDate.getHours().toString().padStart(2, "0");
    const minutes = taskDate.getMinutes().toString().padStart(2, "0");
    const dueTime = `${hours}:${minutes}`;

    setEditingTask({
      ...task,
      dueDate,
      dueTime,
    });
  };

  const handleUpdate = async (updatedTask) => {
    try {
      await onUpdateTask(editingTask.id, updatedTask);
      setEditingTask(null);
      alert("¡Tarea actualizada exitosamente!");
    } catch (error) {
      console.error("Error updating task:", error);
      alert(`Error al actualizar la tarea: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  TaskList.propTypes = {
    tasks: PropTypes.array.isRequired,
    onUpdateTask: PropTypes.func.isRequired,
    onDeleteTask: PropTypes.func.isRequired,
    onToggleComplete: PropTypes.func.isRequired,
  };

  if (editingTask) {
    return (
      <div className="task-list">
        <div className="task-list-header">
          <h2>✏️ Editar Tarea</h2>
          <button className="btn-cancel" onClick={handleCancelEdit}>
            ← Volver a la lista
          </button>
        </div>
        <div className="edit-form-container">
          <TaskForm
            task={editingTask}
            onTaskCreated={handleUpdate}
            onCancel={handleCancelEdit}
            isEditing={true}
          />
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="no-tasks">
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <h3>No hay tareas</h3>
          <p>Crea tu primera tarea usando el formulario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>📋 Lista de Tareas</h2>
        <span className="task-count">{tasks.length} tarea(s)</span>
      </div>

      <div className="tasks-grid">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${task.completed ? "completed" : ""} ${
              isOverdue(task) ? "overdue" : ""
            }`}
          >
            <div className="task-header">
              <div className="task-title-section">
                <h3 className="task-title">{task.title}</h3>
                {task.completed && (
                  <span className="completed-badge">✅ Completada</span>
                )}
                {isOverdue(task) && !task.completed && (
                  <span className="overdue-badge">⚠️ Vencida</span>
                )}
              </div>

              <div className="task-priority">
                <span
                  className="priority-tag"
                  style={{ backgroundColor: priorities[task.priority]?.color }}
                >
                  {priorities[task.priority]?.label}
                </span>
              </div>
            </div>

            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            <div className="task-dates">
              <div className="date-info">
                <span className="date-label">📅 Vence:</span>
                <span
                  className={`due-date ${
                    isOverdue(task) && !task.completed ? "overdue-text" : ""
                  }`}
                >
                  {formatDate(task.dueDate)}
                </span>
              </div>
              <div className="date-info">
                <span className="date-label">🕐 Creada:</span>
                <span className="created-date">
                  {new Date(task.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="task-actions">
              <button
                onClick={() => handleToggleComplete(task)}
                className={`btn-action ${
                  task.completed ? "btn-undo" : "btn-complete"
                }`}
                title={
                  task.completed
                    ? "Marcar como pendiente"
                    : "Marcar como completada"
                }
              >
                {task.completed ? "↶ Deshacer" : "✓ Completar"}
              </button>

              <button
                onClick={() => handleEdit(task)}
                className="btn-action btn-edit"
                title="Editar tarea"
              >
                ✏️ Editar
              </button>

              <button
                onClick={() => handleDelete(task.id)}
                className="btn-action btn-delete"
                title="Eliminar tarea"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
