import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['deadline', 'ASC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, tags } = req.body;
    if (!title || !deadline) {
      return res.status(400).json({ message: 'Title and deadline are required' });
    }
    const task = await Task.create({
      userId: req.user.id,
      title, description, priority, deadline,
      tags: tags ? tags.split(',').map(t => t.trim()).join(',') : null
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const { title, description, priority, deadline, tags, done } = req.body;
    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      priority: priority || task.priority,
      deadline: deadline || task.deadline,
      tags: tags ? tags.split(',').map(t => t.trim()).join(',') : task.tags,
      done: done !== undefined ? done : task.done
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.update({ done: !task.done });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};