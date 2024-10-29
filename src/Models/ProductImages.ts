import { DataTypes, Model } from "sequelize";
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
      unique: true,
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

sequelize.sync({ alter: true }).then(() => {
  console.log("Table ProductImages created.");
});

export default ProductImages;
