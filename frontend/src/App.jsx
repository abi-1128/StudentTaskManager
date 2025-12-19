import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import { FaPlus } from 'react-icons/fa';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      params.sortBy = sortBy;
      
      const data = await getTasks(params);
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, sortBy]);

  const handleCreate = async (taskData) => {
    try {
      await createTask(taskData);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task");
    }
  };

  const handleUpdate = async (taskData) => {
    try {
      await updateTask(editingTask._id, taskData);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    }
  };

  const handleToggleComplete = async (id, updates) => {
    try {
      await updateTask(id, updates);
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowForm(false); // Ensure main add form is closed if we use modal, but here we reuse the form area or scroll to it
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Task Manager</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingTask(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> {showForm ? 'Close Form' : 'Add Task'}
          </button>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {(showForm || editingTask) && (
          <TaskForm
            onSubmit={editingTask ? handleUpdate : handleCreate}
            initialData={editingTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onUpdate={handleToggleComplete}
            onDelete={handleDelete}
            onEdit={openEditModal}
          />
        )}
      </div>
    </div>
  );
}

export default App;
