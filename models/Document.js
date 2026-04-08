import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const Document = sequelize.define('Document', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mimetype: {
    type: DataTypes.STRING
  },
  size: {
    type: DataTypes.INTEGER
  },
  folder: {
    type: DataTypes.STRING,
    defaultValue: 'General'
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: true });

User.hasMany(Document, { foreignKey: 'userId', onDelete: 'CASCADE' });
Document.belongsTo(User, { foreignKey: 'userId' });

export default Document;