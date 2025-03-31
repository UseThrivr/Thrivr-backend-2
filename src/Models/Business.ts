import { DataTypes, Model, Sequelize } from "sequelize";
const sequelize = require("./../setup/Sequelize");

class Business extends Model {
  public id!: number;
  public full_name!: string;
  public business_name!: string;
  public location!: string;
  public email!: string;
  public phone_number!: string;
  public description!: string;
  public password!: string;
  public image_path!: string;
  public role!: string;
  public is_oauth!: boolean;
}


Business.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    business_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },

    image_path: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    wallet_balance: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    role: {
      type: DataTypes.STRING,
      defaultValue: "business",
      allowNull: false,
    },

    is_oauth: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "business",
  }
);

export default Business;
