import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function TaskForm({ onTaskCreated, onCancel, task, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '12:00',
    priority: 'MEDIUM'
  });

  const priorities = [
    { value: 'LOW', label: '🔵 Baja', color: '#48bb78' },
    { value: 'MEDIUM', label: '🟡 Media', color: '#ed8936' },
    { value: 'HIGH', label: '🟠 Alta', color: '#f56565' },
    { value: 'URGENT', label: '🔴 Urgente', color: '#e53e3e' }
  ];

  useEffect(() => {
    if (isEditing && task) {
      const taskDate = new Date(task.dueDate);
      const dueDate = taskDate.toISOString().split('T')[0];
      const hours = taskDate.getHours().toString().padStart(2, '0');
      const minutes = taskDate.getMinutes().toString().padStart(2, '0');
      const dueTime = `${hours}:${minutes}`;
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: dueDate,
        dueTime: dueTime,
        priority: task.priority || 'MEDIUM'
      });
    }
  }, [isEditing, task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    if (!formData.dueDate) {
      alert('La fecha de vencimiento es obligatoria');
      return;
    }

    const dueDateTime = `${formData.dueDate}T${formData.dueTime}:00`;

    const taskData = {
      title: formData.title,
      description: formData.description,
      dueDate: dueDateTime,
      priority: formData.priority
    };

    try {
      await onTaskCreated(taskData);
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          dueTime: '12:00',
          priority: 'MEDIUM'
        });
        alert('¡Tarea creada exitosamente!');
      }
    } catch (error) {
      console.error('Error creating/updating task:', error);
      alert(`Error al ${isEditing ? 'actualizar' : 'crear'} la tarea`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="task-form">
      <h2>{isEditing ? '✏️ Editar Tarea' : '➕ Crear Nueva Tarea'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Reunión con el equipo"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ej: Preparar presentación para la reunión..."
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Fecha *</label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={getMinDate()}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dueTime">Hora *</label>
            <input
              id="dueTime"
              type="time"
              name="dueTime"
              value={formData.dueTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Prioridad</label>
          <select 
            id="priority"
            name="priority" 
            value={formData.priority} 
            onChange={handleChange}
            className="priority-select"
          >
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <div className="priority-preview">
          <span className="priority-label">
            Prioridad: 
            <span 
              className="priority-badge" 
              style={{ 
                backgroundColor: priorities.find(p => p.value === formData.priority)?.color 
              }}
            >
              {priorities.find(p => p.value === formData.priority)?.label}
            </span>
          </span>
          {formData.dueDate && (
            <span className="datetime-preview">
              📅 Vence: {new Date(
                Number(formData.dueDate.split('-')[0]),
                Number(formData.dueDate.split('-')[1]) - 1,
                Number(formData.dueDate.split('-')[2]),
                Number(formData.dueTime.split(':')[0]),
                Number(formData.dueTime.split(':')[1])
              ).toLocaleString('es-ES', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {isEditing ? '💾 Guardar Cambios' : 'Crear Tarea'}
          </button>
          {onCancel && (
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

TaskForm.propTypes = {
  onTaskCreated: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  task: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    priority: PropTypes.string
  }),
  isEditing: PropTypes.bool
};

TaskForm.defaultProps = {
  onCancel: null,
  task: null,
  isEditing: false
};

export default TaskForm;