import { DataTypes, Model } from "sequelize";
import Products from "./Product";
const sequelize = require("./../setup/Sequelize");

class ProductImages extends Model {
  public id!: number;
  public product_id!: number;
  public image_path!: string;
}

ProductImages.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Products,
        key: 'id',
      },
    },

    image_path: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
  },
  {
    sequelize,
    tableName: "product_images",
  }
);


export default ProductImages;
