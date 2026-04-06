import cron from 'node-cron';
import { Op } from 'sequelize';
import Task from '../models/Task.js';
import User from '../models/user.js';
import nodemailer from 'nodemailer';

const startReminderCron = () => {
  cron.schedule('*/30 * * * *', async () => {
    try {
      const now = new Date();
      const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      const tasks = await Task.findAll({
        where: {
          done: false,
          deadline: { [Op.between]: [now, in2Hours] }
        },
        include: [{ model: User, attributes: ['email', 'name'] }]
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      for (const task of tasks) {
        const user = task.User;
        if (!user?.email) continue;

        await transporter.sendMail({
          from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `⏰ Reminder: "${task.title}" is due soon!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px;
                        margin: auto; padding: 24px; background: #f9f9f9; border-radius: 12px;">
              <h2 style="color: #7c6dfa;">⚡ TaskFlow Reminder</h2>
              <p>Hi <strong>${user.name}</strong>,</p>
              <p>Your task <strong>"${task.title}"</strong> is due in less than 2 hours.</p>
              <p><strong>Deadline:</strong> ${new Date(task.deadline).toLocaleString()}</p>
              <p><strong>Priority:</strong> ${task.priority}</p>
            </div>
          `
        });
        console.log(`Reminder sent to ${user.email} for task: ${task.title}`);
      }
    } catch (error) {
      console.error('Cron error:', error.message);
    }
  });

  console.log('Reminder cron job started');
};

export default startReminderCron;