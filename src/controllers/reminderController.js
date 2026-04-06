import Task from '../models/Task.js';
import Reminder from '../models/Reminder.js';
import { Op } from 'sequelize';

export const getReminders = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
        done: false,
        deadline: { [Op.gte]: new Date() }
      },
      order: [['deadline', 'ASC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOverdue = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
        done: false,
        deadline: { [Op.lt]: new Date() }
      },
      order: [['deadline', 'ASC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReminder = async (req, res) => {
  try {
    const { taskId, reminderTime, message } = req.body;
    const task = await Task.findOne({
      where: { id: taskId, userId: req.user.id }
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const reminder = await Reminder.create({
      userId: req.user.id,
      taskId,
      reminderTime,
      message: message || `Reminder: "${task.title}" is due soon`
    });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    await reminder.destroy();
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};