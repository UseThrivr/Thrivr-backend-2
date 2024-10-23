const { Sequelize } = require('sequelize');

import dotenv from "dotenv";
dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_CONNECTION = process.env.DB_CONNECTION;


const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_CONNECTION
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err:any) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
