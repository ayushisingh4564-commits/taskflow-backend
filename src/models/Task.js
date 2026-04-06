import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const Task = sequelize.define('Task', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    defaultValue: 'Medium'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tags: {
    type: DataTypes.STRING, // stored as comma-separated string
    allowNull: true
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { timestamps: true });

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

export default Task;