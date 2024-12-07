import { DataTypes, Model } from "sequelize";
const sequelize = require('./../setup/Sequelize');

class Orders extends Model {
    public id!:number;
    public customer_name!:string;
    public customers_contact!:string;
    public sales_channel!:string;
    public payment_channel!:string;
    public order_date!:string;
    public payment_status!:string;
    public note!:string;
}

Orders.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        business_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        customer_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customers_contact: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sales_channel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payment_channel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        order_date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payment_status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        note: {
            type: DataTypes.TEXT,
            defaultValue: '',
            allowNull: false,
        },

    },
    {
        sequelize,
        tableName: "orders",
    }
)


// sequelize.sync({ alter: true }).then(() => {
//     console.log('Table Orders created.');
// });

export default Orders;