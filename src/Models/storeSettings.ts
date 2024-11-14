import { DataTypes, Model } from "sequelize";
import Business from "./Business";
const sequelize = require("./../setup/Sequelize");

class Settings extends Model {
  public id!: number;
  public banner_image!: string;
  public working_days!: string;
  public opening_hours!: string;
  public currency!: string;
  public store_id!: number;
  public theme!:string; // Renamed to match field name in init
}

Settings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    banner_image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },

    theme: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },

    working_days: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },

    opening_hours: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },

    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },

    store_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      references: {
        model: Business,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: "Settings",
    modelName: 'Settings',
  }
);


// Sync the table with the database, altering if necessary
sequelize.sync({ alter: true }).then(() => {
  console.log("Table Settings created.");
});

export default Settings;