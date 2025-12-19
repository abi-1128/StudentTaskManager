import React from 'react';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const TaskCard = ({ task, onUpdate, onDelete, onEdit }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const handleToggleComplete = () => {
    onUpdate(task._id, { completed: !task.completed });
  };

  return (
    <div className={`p-4 rounded-lg shadow-md border-l-4 ${task.completed ? 'bg-gray-50 border-gray-400' : 'bg-white border-blue-500'} mb-4 transition-all hover:shadow-lg`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${priorityColors[task.priority] || 'bg-gray-100'}`}>
              {task.priority}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          <div className="text-xs text-gray-500">
            Due: {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No date'}
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <button 
            onClick={handleToggleComplete}
            className={`p-2 rounded-full ${task.completed ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'} hover:opacity-80`}
            title={task.completed ? "Mark Incomplete" : "Mark Complete"}
          >
            {task.completed ? <FaTimes /> : <FaCheck />}
          </button>
          <button 
            onClick={() => onEdit(task)}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:opacity-80"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button 
            onClick={() => onDelete(task._id)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:opacity-80"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
