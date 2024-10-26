import { DataTypes, Model } from "sequelize";
const sequelize = require("./../setup/Sequelize");

class Products extends Model {
  public id!: number;
  public name!: string;
  public price!: string;
  public category!: string;
  public description!: string;
  public business_id!: number;
  public amount_left!: number;
}

Products.init(
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

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    business_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },

    amount_left: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);

sequelize.sync({ alter: true }).then(() => {
  console.log("Table products created.");
});

export default Products;
