const { Sequelize } = require('sequelize');
import dotenv from "dotenv";
import fs from "fs";
const path = require('path');

dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_CONNECTION = process.env.DB_CONNECTION;
const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV == 'dev') {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_CONNECTION
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
} else {
  const DATABASE_URL = process.env.DATABASE_URL;
  const caPath = path.resolve(__dirname, 'ca.pem');
  console.log('Certificate Path:', caPath);

  try {
    const sequelize = new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          rejectUnauthorized: true,
          ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUO15GOfNs00gwJOkIBSiSUGvKm7AwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZDg4ODM3M2UtZjNjOS00NDRhLWI4NTktNWQzM2JmOWZj
MWYxIFByb2plY3QgQ0EwHhcNMjQxMjMxMTEwMzA0WhcNMzQxMjI5MTEwMzA0WjA6
MTgwNgYDVQQDDC9kODg4MzczZS1mM2M5LTQ0NGEtYjg1OS01ZDMzYmY5ZmMxZjEg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAM4iw+de
HB2uiGDcWQn+mkxUjDYouMj6NJfAaHFgt8qSLUkXVO3rtSXd7TTLHMqz/q0pIAC9
qxPetGB39cPSclzyirx65GiyJx3Iu2OO4485aecmizSNZbMFBlu0TeILZ738cfno
MbMFJoL2LvxjSnsV41FMjm0PQPzxw3o++s/PRvAPEd+c2Kw5Adc6Z0orxTNpIlA/
NV5CNGw+UmPmqcLtC1YMkXZR2rbRObDXOAYKbuZWyR83tBs3l2JDkTXA4EojILZS
OcnhklaZgPEfQYu2zB6PTiwB5lY+NLkZOJr6oN26cstXcFjVV1BXmxhiR75+syAf
ztP1oVkg+zqGF4kKnqjO+q0mS0U0QvTSXj/bbDWKxStpQ38C4nlWtidOgxOHrxLl
49CowtZvgnXEYL+ISbOoTUA8SrzjW/x+lbkpe5IR2lZQT6sYcYd9oKPr68dlncUT
DYVBn5S6xngcnyGiNcX2aUT3QLGXxTF6MbZyCLqiDF3sR3R7CNYRBNwsZQIDAQAB
oz8wPTAdBgNVHQ4EFgQUuU579+V2YZVcntygXfTp1tzstLUwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBADiBkDddzcZDtZT/
zcgsybglNKpBd7/wmzAZVdblvxjIaJn/mfgEPtr8sJb7c6UBLsE4zlHNJSbbvY4T
vWtq6jndp+XOJCDwWXYTJA78Mry3niglRz4lVlnbTBPlVJk7lfevmTcBW/6Tp1Tw
F8d5+KXGI/Q+u60K9RoEKfsmaleFvVGdbofluJcH0MD/0WA5T0xGvMJzj6e+6afl
OIxkYot3Q9+TwY6TPcrauRtHJC7EQ3BlPcaimbsT+L01KOnutQFG41rZQ43jUD1w
Sy9UnGaGBKhfPYai3wdAVR9qjNTPnYulr5rMHYk68w8c9dclowKzr0aebNTXKDhU
8C43QpidCPSlVZzxyc3ZakefPyKeZZ+IAEWQr/BhqSzV0y/5HrjNBlql6C6CqESe
3Rz3BU/3RBRUR7jBRF2uFKCT/EOe6PBtn5AlIigPPOZ01UFOygqQYQVhdi2rkGfl
hj6DPiyqXM6rT841UMcyfrG9rh88H+lTtQVln9/CQyXk4leDTA==
-----END CERTIFICATE-----
`
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
  } catch (error) {
    console.error('Error reading CA file:', error);
  }
}
