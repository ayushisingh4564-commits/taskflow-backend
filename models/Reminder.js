import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Task from './Task.js';

const Reminder = sequelize.define('Reminder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Task, key: 'id' }
  },
  reminderTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { timestamps: true });

User.hasMany(Reminder, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reminder.belongsTo(User, { foreignKey: 'userId' });
Task.hasMany(Reminder, { foreignKey: 'taskId', onDelete: 'CASCADE' });
Reminder.belongsTo(Task, { foreignKey: 'taskId' });

export default Reminder;