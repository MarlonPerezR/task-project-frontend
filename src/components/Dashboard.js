import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const Dashboard = ({ tasks }) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    upcoming: 0
  });

  const calculateStats = useCallback(() => {
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const completedTasks = tasks.filter(task => task.completed);
      const overdueTasks = tasks.filter(task => 
        !task.completed && new Date(task.dueDate) < today
      );
      const upcomingTasks = tasks.filter(task => 
        !task.completed && new Date(task.dueDate) <= nextWeek
      );

      setStats({
        total: tasks.length,
        completed: completedTasks.length,
        pending: tasks.length - completedTasks.length,
        overdue: overdueTasks.length,
        upcoming: upcomingTasks.length
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  }, [tasks]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>
      <div className="stats-grid">
        <StatCard
          title="Total Tareas"
          value={stats.total}
          color="#667eea"
          icon="📋"
        />
        <StatCard
          title="Completadas"
          value={stats.completed}
          color="#10b981"
          icon="✅"
        />
        <StatCard
          title="Pendientes"
          value={stats.pending}
          color="#f59e0b"
          icon="⏳"
        />
        <StatCard
          title="Vencidas"
          value={stats.overdue}
          color="#ef4444"
          icon="⚠️"
        />
        <StatCard
          title="Próximas"
          value={stats.upcoming}
          color="#8b5cf6"
          icon="📅"
        />
      </div>

      {stats.overdue > 0 && (
        <div className="alert alert-warning">
          <strong>⚠️ Atención:</strong> Tienes {stats.overdue} tarea(s) vencida(s) que necesitan tu atención.
        </div>
      )}

      {stats.upcoming > 0 && (
        <div className="alert alert-info">
          <strong>📅 Recordatorio:</strong> Tienes {stats.upcoming} tarea(s) programada(s) para esta semana.
        </div>
      )}

      {stats.total === 0 && (
        <div className="alert alert-info">
          <strong>👋 Bienvenido:</strong> Comienza creando tu primera tarea usando el formulario a la izquierda.
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div className="stat-card" style={{ borderLeftColor: color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

Dashboard.propTypes = {
  tasks: PropTypes.array.isRequired
};

export default Dashboard;