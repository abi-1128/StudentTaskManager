const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { v4: uuidv4 } = require('uuid'); // Need to install uuid or use simple counter

// In-memory store
let tasks = [];

// Helper to get tasks (DB or Memory)
const getTasks = async (query, sort) => {
    // In-memory implementation
    let filtered = [...tasks];
    if (query.completed !== undefined) {
        filtered = filtered.filter(t => t.completed === query.completed);
    }
    
    // Simple sort
    if (sort.priority) {
        const priorities = { low: 1, medium: 2, high: 3 };
        filtered.sort((a, b) => priorities[b.priority] - priorities[a.priority]); // High to Low
    } else if (sort.dueDate) {
        filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return filtered;
};

// GET /api/tasks - List tasks
router.get('/', async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    let query = {};
    if (status === 'pending') query.completed = false;
    else if (status === 'completed') query.completed = true;

    let sort = {};
    if (sortBy === 'priority') sort = { priority: 1 };
    else if (sortBy === 'dueDate') sort = { dueDate: 1 };
    else sort = { createdAt: -1 };

    if (!req.isConnected) {
       const memoryTasks = await getTasks(query, sort);
       return res.json(memoryTasks);
    }

    const tasks = await Task.find(query).sort(sort);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/:id - Single task
router.get('/:id', async (req, res) => {
  try {
    if (!req.isConnected) {
        const task = tasks.find(t => t._id === req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        return res.json(task);
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks - Create task
router.post('/', async (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  
  if (!req.isConnected) {
      const newTask = {
          _id: crypto.randomUUID(),
          title,
          description,
          priority: priority || 'medium',
          dueDate: dueDate || null,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
      };
      tasks.push(newTask);
      return res.status(201).json(newTask);
  }

  const task = new Task({
    title,
    description,
    priority,
    dueDate,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    if (!req.isConnected) {
        const index = tasks.findIndex(t => t._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Task not found' });
        
        const task = tasks[index];
        if (req.body.title != null) task.title = req.body.title;
        if (req.body.description != null) task.description = req.body.description;
        if (req.body.priority != null) task.priority = req.body.priority;
        if (req.body.dueDate != null) task.dueDate = req.body.dueDate;
        if (req.body.completed != null) task.completed = req.body.completed;
        task.updatedAt = new Date();
        
        tasks[index] = task;
        return res.json(task);
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.body.title != null) task.title = req.body.title;
    if (req.body.description != null) task.description = req.body.description;
    if (req.body.priority != null) task.priority = req.body.priority;
    if (req.body.dueDate != null) task.dueDate = req.body.dueDate;
    if (req.body.completed != null) task.completed = req.body.completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    if (!req.isConnected) {
        const index = tasks.findIndex(t => t._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Task not found' });
        
        tasks.splice(index, 1);
        return res.json({ message: 'Task deleted' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
