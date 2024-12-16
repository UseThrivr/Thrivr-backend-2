import { DataTypes, Model } from "sequelize";
const sequelize = require("./../setup/Sequelize");

class Task extends Model {
  public id!: number;
  public title!: string;
  public details!: string;
  public due_date!: string;
  public time!: string;
  public reminder!: string;
  public password!: string;
  public image_path!: string;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    details: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },

    due_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },

    reminder: {
      type: DataTypes.TEXT,     
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tasks",
  }
);

export default Task;
