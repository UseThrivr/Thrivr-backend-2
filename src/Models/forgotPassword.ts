import { DataTypes, Model } from "sequelize";
const sequelize = require("./../setup/Sequelize");

class ForgotPassword extends Model {
  public id!: number;
  public token!: string;
  public email!: string;
}

ForgotPassword.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: "forgot_password",
  }
);

export default ForgotPassword;
