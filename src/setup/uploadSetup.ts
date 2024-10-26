import { Request } from "express";

const multer = require("multer");
const path = require("path");



const businessLogoStorage = multer.diskStorage({
  destination: (req: Request, file: File, cb: any) => {
    cb(null, "./../public/business_logos/");
  },
  filename: (req: Request, file: any, cb: any) => {
    const uniqueFileName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueFileName);
  },
});

const productImageStorage = multer.diskStorage({
    destination: (req: Request, file: File, cb: any) => {
      cb(null, "./../public/product_imaegs/");
    },
    filename: (req: Request, file: any, cb: any) => {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      cb(null, uniqueFileName);
    },
  });

const uploadBusinessLogo = multer({ storage: businessLogoStorage });
const uploadProdutImage = multer({ storage: businessLogoStorage });


export default [uploadBusinessLogo, uploadProdutImage];
