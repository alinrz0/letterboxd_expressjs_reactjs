import {DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';  

interface AdminAttributes {
  id: number;
  username: string;
  password: string;
}

interface AdminCreationAttributes extends Optional<AdminAttributes, 'id'> {}

class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: number;
  public username!: string;
  public password!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
    private _id: any;
}

const AdminModel = sequelize.define<Admin, AdminCreationAttributes>('admin', {
    username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default AdminModel;
