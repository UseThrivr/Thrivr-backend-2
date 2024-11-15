import { DataTypes, Model } from "sequelize";
import Business from "./Business";
const sequelize = require("./../setup/Sequelize");

class Group extends Model {
  public id!: number;
  public name!: string;
  public store_id!: number;
}

Group.init(
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
    tableName: "Group",
  }
);

sequelize.sync({ alter: true }).then(() => {
  console.log("Table Group created.");
});

export default Group;