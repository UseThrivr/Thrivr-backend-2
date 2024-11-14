import { NextFunction, Response } from "express";
import Business from "../Models/Business";
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

let middlewares = {
  authenticateToken: (
    req: Request | any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const preToken = req.headers.authorization as string;
      if (preToken == undefined) {
        res.status(401).json({ error: "Unauthorized access." });
      } else {
        const token = preToken.split(" ")[1];

        if (!token) {
          res
            .status(401)
            .json({ sucess: false, error: "Unauthorized access." });
        }

        jwt.verify(token, secretKey, (err: any, decoded: any) => {
          if (err) {
            res.status(401).json({ sucess: false, error: "Error." });
          } else {
            if (!decoded) {
              res.status(401).json({ error: "Unauthorized access." });
            } else {
              req.user = decoded;
              next();
            }
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error." });
    }
  },

  verifyBusiness: async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const preToken = req.headers.authorization as string;
  
      if (!preToken) {
        return res.status(401).json({ success: false, error: "Unauthorized access.", message: 'No token provided.' });
      }
  
      const token = preToken.split(" ")[1];
  
      if (!token) {
        return res.status(401).json({ success: false, error: "Unauthorized access.", message: 'No token provided.' });
      }
  
      jwt.verify(token, secretKey, async (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({ success: false, error : 'Unauthorized access.', message: "Invalid or expired token." });
        }
  
        const email = decoded?.email;
        if (!email) {
          return res.status(401).json({ success: false, error: "Unauthorized access." });
        }
  
        const business = await Business.findOne({ where: { email } });
        if (!business) {
          return res.status(404).json({ success: false, error: "Unauthorized access." });
        }
  
        req.user = decoded;
        next();
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Server error." });
    }
  },
  
};

export default middlewares;
