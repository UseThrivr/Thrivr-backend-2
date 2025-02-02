import { DataTypes, Model } from "sequelize";
import ProductImages from "./ProductImages";
import Business from "./Business";
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
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    purchaseDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    supplier: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Business,
        key: 'id',
      },
    },

    amount_left: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);

export default Products;
