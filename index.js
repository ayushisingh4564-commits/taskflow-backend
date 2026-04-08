import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import startReminderCron from './cron/reminderCron.js';

dotenv.config();
console.log(" i am running")

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();
startReminderCron();

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => res.json({ message: 'TaskFlow API running' }));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} busy, retrying...`);
    setTimeout(() => {
      server.close();
      server.listen(PORT);
    }, 1000);
  }
});