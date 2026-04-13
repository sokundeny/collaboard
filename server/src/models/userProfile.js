import { DataTypes } from 'sequelize';
import sequelize from '../config/connectdb.js';

const UserProfile = sequelize.define('UserProfile', {
  public_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secure_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'userprofiles',
  timestamps: true,
});

export default UserProfile;