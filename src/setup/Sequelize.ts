const { Sequelize } = require('sequelize');
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_CONNECTION = process.env.DB_CONNECTION;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || './ca.pem';

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_CONNECTION,
  dialectOptions: {
    ssl: {
      require: true,
      ca: fs.readFileSync(SSL_CERT_PATH).toString(),
    },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
