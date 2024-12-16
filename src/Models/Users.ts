import { DataTypes, Model } from "sequelize";
const sequelize = require("./../setup/Sequelize");

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    wallet_balance: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },

    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
