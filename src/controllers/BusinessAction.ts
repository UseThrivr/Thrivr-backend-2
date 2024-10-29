import { Request, Response } from "express";
import Products from "../Models/Product";
import ProductImages from "../Models/ProductImages";
import Business from "../Models/Business";
import Orders from "../Models/Order";

interface addProductRequest {
  name: string;
  price: string;
  category: string;
  description: string;
  logo?: any;
}

interface afterBusinessVerificationMiddleware {
  user: { id?: number; role?: string };
}

interface ActionsInterface {
  addProduct: Function;
  getProduct: Function;
  getOrder: Function;
  fetchBusiness: Function;
}

const Actions: ActionsInterface = {
  addProduct: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    try {
      const body = req.body as unknown as addProductRequest[];
      body.forEach((product) => {
        const { name, price, category, description, logo } = product;
        const user = req.user;
        const business_id = user.id;
        if (
          !user ||
          !name ||
          !price ||
          !category ||
          !description ||
          !business_id
        ) {
          res.status(400).json({ error: "Bad request." });
        } else {
          if (user.role != "business") {
            res.status(401).json({ error: "Unauthoried access." });
          } else {
            Products.create({
              name: name,
              price: price,
              category: category,
              description: description,
              business_id: user.id,
            }).then((product) => {
              if (product) {
                let imagePath = "";
                if (logo) {
                  // TO-DO: save image logic.
                }
                ProductImages.create({
                  product_id: product.id,
                  image_path: imagePath,
                }).then(() => {
                  res.status(201).json({
                    success: true,
                    message: "Product created successfully",
                  });
                });
              } else {
                res.status(500).json({ error: "Server error." });
              }
            });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Server error." });
    }
  },

  getProduct: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    try {
      const user = req.user;
      const business_id = user.id;
      const { id } = req.params;

      if (!id) {
        if (user.role != "business") {
          res.status(401).json({ error: "Unauthorized access." });
        } else {
          if (!business_id) {
            res.status(400).json({ error: "Bad request." });
          } else {
            const business = await Business.findOne();
            if (!business) {
              res.status(404).json({ error: "Business does not exist" });
            } else {
              Products.findAll({ where: { business_id: business_id } }).then(
                (fetchedProducts) => {
                  if (fetchedProducts) {
                    res
                      .status(200)
                      .json({ success: true, data: fetchedProducts });
                  } else {
                    res.status(500).json({ error: "Error fetching products." });
                  }
                }
              );
            }
          }
        }
      } else {
        await Products.findOne({
          where: { id: id },
        }).then((product) => {
          if (!product) {
            res.status(404).json({ error: "Product does not exist." });
          } else {
            res.status(200).json({ success: true, data: product });
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error." });
    }
  },

  getOrder: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    try {
      const user = req.user;
      const business_id = user.id;
      const { id } = req.params;

      if (!user || !business_id) {
        res.status(401).json({ error: "Unauthorized access." });
      } else {
        if (!id) {
          if (user.role != "business") {
            res.status(401).json({ error: "Unauthorized access." });
          } else {
            const business = await Business.findOne();
            if (!business) {
              res.status(404).json({ error: "Business does not exist" });
            } else {
              Orders.findAll({ where: { business_id: business_id } }).then(
                (fetchedOrders) => {
                  if (fetchedOrders) {
                    res
                      .status(200)
                      .json({ success: true, data: fetchedOrders });
                  } else {
                    res
                      .status(500)
                      .json({ error: "Error fetching order details." });
                  }
                }
              );
            }
          }
        } else {
          await Orders.findOne({
            where: { id: id },
          }).then((order) => {
            if (!order) {
              res.status(404).json({
                error: "The order you requested for does not exist. 😓",
              });
            } else {
              res.status(200).json({ success: true, data: order });
            }
          });
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Server error." });
    }
  },

  fetchBusiness: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({ error: "Unauthorized access." });
    } else {
      await Business.findOne({ where: { id: id } })
        .then((business) => {
          const { password, createdAt, updatedAt, ...businessOut } =
            business?.dataValues;
          res.status(200).json({ success: true, data: businessOut });
        })
        .catch(() => {
          res.status(500).json({ error: "Server error" });
        });
    }
  },
};

export default Actions;
