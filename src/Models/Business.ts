import { DataTypes, Model } from "sequelize";
const sequelize = require("./../setup/Sequelize");
import Settings from "./storeSettings"; // Assuming Settings is in the same directory
import Group from "./Group";

class Business extends Model {
  public id!: number;
  public full_name!: string; // Ensure you are consistent with 'full_name' here
  public business_name!: string;
  public location!: string;
  public email!: string;
  public phone_number!: string;
  public description!: string;
  public password!: string;
  public image_path!: string;
  public role!: string;
}

// Define the Business table
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
      unique: true,
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

// Define the association: A Business has one Settings
Business.hasMany(Settings, {
  foreignKey: 'store_id', // Assuming 'store_id' is used in Settings as a reference to Business
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

Business.hasMany(Group, {
  foreignKey: 'store_id', // Reference column in Staff
  sourceKey: 'id',        // Primary key in Business
  onDelete: 'CASCADE',    // Optional: set cascading delete
});


// Sync the table with the database
sequelize.sync({ alter: true }).then(() => {
  console.log("Table business created.");
});

export default Business;
