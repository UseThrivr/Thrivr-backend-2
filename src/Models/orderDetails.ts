import { DataTypes, Model } from "sequelize";
const sequelize = require('./../setup/Sequelize');

class orderProducts extends Model {
    public id!:number;
    public order_id!:string;
    public product_id!:string;
}

orderProducts.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    },
    {
        sequelize,
        tableName: "orderProducts",
    }
)


export default orderProducts;