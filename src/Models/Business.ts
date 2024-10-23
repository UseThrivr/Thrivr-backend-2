import { DataTypes, Model } from "sequelize";
const sequelize = require("./../setup/Sequelize");

class Business extends Model {
  public id!: number;
  public name!: string;
  public location!: string;
  public email!: string;
  public phone_number!: string;
  public description!: string;
  public password!: string;
  public image_path!: string;
}

Business.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    location: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    phone_number: {
      type: DataTypes.NUMBER,
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

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.STRING,
      defaultValue: "business",
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "business",
  }
);

sequelize.sync({ alter: true }).then(() => {
  console.log("Table business created.");
});

export default Business;
