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

  verifyBusiness: async (
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
        } else {
          jwt.verify(token, secretKey, async (err: any, decoded: any) => {
            if (err) {
              res.status(401).json({ sucess: false, error: "Error." });
            } else {
              let email = decoded.email;
              if (!email) {
                res.status(401).json({ error: "Unauthorized access." });
              } else {
                let business = await Business.findOne({
                  where: { email: email },
                });
                if (!business) {
                  res.status(404).json({ error: "Business not found." });
                } else {
                  req.user = decoded;
                  next();
                }
              }
            }
          });
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Server error." });
    }
  },
};

export default middlewares;
