import dotenv from "dotenv";
import Auth from "./controllers/Auth";
import middlewares from "./middlewares/verifyToken";
import Actions from "./controllers/BusinessAction";
import Products from "./Models/Product";
import Business from "./Models/Business";
import ProductImages from "./Models/ProductImages";
import Orders from "./Models/Order";
import Settings from "./Models/storeSettings";
import Group from "./Models/Group";
const express = require("express");
const session = require("express-session");
const cors = require("cors");
var bodyParser = require("body-parser");
const sequelize = require("./setup/Sequelize");

const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

require("./setup/Sequelize");

dotenv.config();


const app = express();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadBusinessBanner = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUSINESS_LOGO_BUCKET_NAME,
    metadata: (req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: any, file: any, cb: any) => {
      const uniqueName = Date.now().toString() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `business_banner/${uniqueName}${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size of 10MB
});

const uploadBusinessLogo = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUSINESS_LOGO_BUCKET_NAME,
    metadata: (req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: any, file: any, cb: any) => {
      const uniqueName = Date.now().toString() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `business_logos/${uniqueName}${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size of 10MB
});

const uploadProductLogo = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUSINESS_LOGO_BUCKET_NAME,
    metadata: (req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: any, file: any, cb: any) => {
      const uniqueName = Date.now().toString() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `Product_images/${uniqueName}${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size of 10MB
});


const FRONTEND_URL: any = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 8000;

interface corsInterface {
  origin: string;
  methods: string[];
  allowedHeaders?: string[];
}

const corsOption: corsInterface = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, //TO-DO: Set to true in production
  })
);

// Auth routes
app.post("/api/v1/auth/signup", Auth.signup);
app.post("/api/v1/auth/login", Auth.login);
app.post("/api/v1/auth/verify-otp", Auth.verifyOTP);
app.post("/api/v1/resend-otp", Auth.resendOTP);
app.post("/api/v1/forgot-password", Auth.forgotPassword);
app.post("/api/v1/reset-password", Auth.resetPassword);
app.post("/api/v1/auth/signup/business", uploadBusinessLogo.single('logo'), Auth.businessSignup);


// fetching details route
app.get("/api/v1/business/:id?", middlewares.verifyBusiness, Actions.fetchBusiness);


//action routes
app.post("/api/v1/products", uploadProductLogo.array('images', 10), middlewares.verifyBusiness, Actions.addProduct);
app.get("/api/v1/products/:id?", middlewares.authenticateToken, Actions.getProduct);
app.get("/api/v1/order/:id?", middlewares.verifyBusiness, Actions.getOrder);
app.post("/api/v1/order/", middlewares.verifyBusiness, Actions.makeOrder);
app.post("/api/v1/tasks", middlewares.verifyBusiness, Actions.addTask);
app.get("/api/v1/tasks/:id?", middlewares.verifyBusiness, Actions.getTasks);
app.patch("/api/v1/tasks/:id/done", middlewares.verifyBusiness, Actions.doTask);
app.patch("/api/v1/order/:id", middlewares.verifyBusiness, Actions.updateOrder);

app.patch("/api/v1/business", middlewares.verifyBusiness, uploadBusinessLogo.single('logo'), Actions.updateBusiness);
app.patch("/api/v1/business/settings", middlewares.verifyBusiness, uploadBusinessBanner.single('logo'), Actions.updateBusinessSettings);
app.post("/api/v1/customer", middlewares.verifyBusiness, Actions.addCustomer);
app.post("/api/v1/group", middlewares.verifyBusiness, Actions.createGroup);
app.post("/api/v1/staff", middlewares.verifyBusiness, Actions.addStaff);


app.get("/api/v1/customer/:id?", middlewares.verifyBusiness, Actions.getCustomer); // query parameter "group" 
app.get("/api/v1/dashboard", middlewares.verifyBusiness, Actions.getDashboard);
app.delete("/api/v1/user", middlewares.verifyBusiness, Actions.deleteAccount);



// TO-DO: add delete account route
// TO-DO: ADD get groups_rout
// TO-DO: i did make order route, update order
//get dashboard route



// foreign key relation to avoid circular dependeency
Products.belongsTo(Business, {
  foreignKey: "business_id",
  as: "business",
});


Products.hasMany(ProductImages, {
  foreignKey: 'product_id', // Assuming 'store_id' is used in Settings as a reference to Business
  sourceKey: 'id',
});

Orders.belongsTo(Business, {
  foreignKey: "business_id",
  as: "orders", // Alias for eager loading
});


Business.hasMany(Settings, {
  foreignKey: 'store_id',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

Business.hasMany(Products, {
  foreignKey: 'business_id',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

Business.hasMany(Orders, {
  foreignKey: 'business_id',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

Business.hasMany(Group, {
  foreignKey: 'store_id',
  sourceKey: 'id',     
  onDelete: 'CASCADE',   
});


const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  } catch (error) {
    console.log("Server error.", error);
  }
};


startServer();