import { DataTypes, Model } from "sequelize";
const sequelize = require("./../setup/Sequelize");

class BusinessStaffs extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
}

BusinessStaffs.init(
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

    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    products: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    manage_payments: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    store_settings: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    order: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    customers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    business_reports: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    business_id : {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  },
  {
    sequelize,
    tableName: "business_staffs",
  }
);


export default BusinessStaffs;
