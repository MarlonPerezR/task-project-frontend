import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const CalendarView = ({ onDateSelect, tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const tasksByDate = useMemo(() => {
    const grouped = {};
    tasks.forEach((task) => {
      const taskDate = new Date(task.dueDate);
      const dateKey = taskDate.toISOString().split('T')[0];
      
      if (grouped[dateKey] === undefined) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(task);
    });
    return grouped;
  }, [tasks]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const startDay = firstDay.getDay();
    const days = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i -= 1) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        tasks: []
      });
    }

    for (let i = 1; i <= daysInMonth; i += 1) {
      const dayDate = new Date(year, month, i);
      const dateKey = dayDate.toISOString().split('T')[0];
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        tasks: tasksByDate[dateKey] || []
      });
    }

    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i += 1) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        tasks: []
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getTaskStatusColor = (task) => {
    if (task.completed) return '#10b981';
    
    const now = new Date();
    const taskDue = new Date(task.dueDate);
    
    if (taskDue < now) return '#ef4444';
    return '#f59e0b';
  };

  const getDayBackgroundColor = (day) => {
    if (day.tasks.length === 0) return 'transparent';
    
    const now = new Date();
    let mostCriticalColor = '#f59e0b';
    
    for (const task of day.tasks) {
      if (task.completed) {
        mostCriticalColor = '#10b981';
      } else {
        const taskDue = new Date(task.dueDate);
        if (taskDue < now) {
          mostCriticalColor = '#ef4444';
          break;
        }
      }
    }
    
    return mostCriticalColor;
  };

  const getDayBorderColor = (day) => {
    if (day.tasks.length === 0) return 'transparent';
    return getDayBackgroundColor(day);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getTaskStatusText = (task) => {
    if (task.completed) return 'Completada';
    const taskDue = new Date(task.dueDate);
    return taskDue < new Date() ? 'Vencida' : 'Pendiente';
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>📅 Calendario de Tareas</h2>
        <div className="calendar-controls">
          <button 
            type="button"
            onClick={goToToday} 
            className="btn-today"
          >
            Hoy
          </button>
          <div className="month-navigation">
            <button 
              type="button"
              onClick={() => navigateMonth(-1)} 
              className="btn-nav"
            >
              ‹
            </button>
            <span className="current-month">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button 
              type="button"
              onClick={() => navigateMonth(1)} 
              className="btn-nav"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {dayNames.map((day) => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((day) => (
            <button
              key={`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}-${day.isCurrentMonth ? 'current' : 'other'}`}
              type="button"
              className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${isToday(day.date) ? 'today' : ''}`}
              onClick={() => onDateSelect(day.date)}
              style={{
                backgroundColor: day.tasks.length > 0 ? `${getDayBackgroundColor(day)}20` : 'transparent',
                border: `2px solid ${getDayBorderColor(day)}`,
                borderLeft: `4px solid ${getDayBorderColor(day)}`
              }}
            >
              <div className="day-number">{day.date.getDate()}</div>
              <div className="day-tasks">
                {day.tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="task-indicator"
                    style={{ backgroundColor: getTaskStatusColor(task) }}
                    title={`${task.title} - ${new Date(task.dueDate).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - ${getTaskStatusText(task)}`}
                  />
                ))}
                {day.tasks.length > 3 && (
                  <div className="more-tasks">+{day.tasks.length - 3}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color completed"></div>
          <span>Completada</span>
        </div>
        <div className="legend-item">
          <div className="legend-color overdue"></div>
          <span>Vencida</span>
        </div>
        <div className="legend-item">
          <div className="legend-color pending"></div>
          <span>Pendiente</span>
        </div>
      </div>
    </div>
  );
};

CalendarView.propTypes = {
  onDateSelect: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    priority: PropTypes.string,
  })).isRequired,
};

CalendarView.defaultProps = {
  tasks: [],
};

export default CalendarView;