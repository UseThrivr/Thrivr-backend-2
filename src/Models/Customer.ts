import { DataTypes, Model } from "sequelize";
const sequelize = require("./../setup/Sequelize");

class Customer extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone_number!: string;
  public group!: string;
  public instagram!: number;
  public business_id!: number;
}

Customer.init(
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
      allowNull: false,
    },

    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    group: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'none'
    },

    instagram: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },

    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "Customer",
  }
);

sequelize.sync({ alter: true }).then(() => {
  console.log("Table Customer created.");
});

export default Customer;
