import React from "react";
import PropTypes from "prop-types";

const TaskFilter = ({ filter, onFilterChange }) => {
  const filters = [
    { value: "all", label: "📋 Todas las tareas", icon: "📋" },
    { value: "pending", label: "⏳ Pendientes", icon: "⏳" },
    { value: "completed", label: "✅ Completadas", icon: "✅" },
    { value: "overdue", label: "⚠️ Vencidas", icon: "⚠️" },
    { value: "upcoming", label: "📅 Próximas", icon: "📅" },
  ];

  TaskFilter.propTypes = {
    filter: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  };

  return (
    <div className="task-filter">
      <div className="filter-buttons">
        {filters.map((filterOption) => (
          <button
            key={filterOption.value}
            onClick={() => onFilterChange(filterOption.value)}
            className={filter === filterOption.value ? "active" : ""}
          >
            <span className="filter-icon">{filterOption.icon}</span>
            {filterOption.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilter;
