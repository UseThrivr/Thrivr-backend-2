import { Request, Response } from "express";
import Products from "../Models/Product";
import ProductImages from "../Models/ProductImages";
import Business from "../Models/Business";
import Orders from "../Models/Order";
import Task from "../Models/Task";
import Settings from "../Models/storeSettings";
import Customer from "../Models/Customer";
import Group from "../Models/Group";
import BusinessStaffs from "../Models/BusinessStaffs";
const nodemailer = require("nodemailer");
import User from "../Models/Users";
import orderProducts from "../Models/orderDetails";
import { Op, where } from "sequelize";

interface addProductRequest {
  name: string;
  price: string;
  category: string;
  description: string;
  purchase_date: string;
  supplier: string;
  images?: any;
}

interface afterBusinessVerificationMiddleware {
  user: { id: number; role: string; full_name:string, email: string };
}

interface ActionsInterface {
  addProduct: Function;
  getProduct: Function;
  getOrder: Function;
  getSales: Function;
  makeOrder: Function;
  fetchBusiness: Function;
  addTask: Function;
  getTasks: Function;
  doTask: Function;
  updateBusiness: Function;
  updateBusinessSettings: Function;
  addCustomer: Function;
  getCustomer: Function;
  createGroup: Function;
  addStaff: Function;
  updateOrder: Function;
  getDashboard: Function;
  deleteAccount: Function;
}

const addToWallet = (userId: number, amount: number) => {
  Business.increment("wallet_balance", {
    by: amount,
    where: { id: userId },
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const productPurchaseMail = async (
  email: string,
  name: string,
  products: Products [],
  orderNumber: string
) => {
  try {
    let total = 0;
    products.forEach(product => {
      total = total + parseFloat(product.price);
    });
    const mailOptions = {
      from: "Thrivr <no-reply@thrivr.com>",
      to: email,
      subject: "Thank You for Your Purchase! 🍾",
      html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
            }
            h1 {
                color: #333;
                font-size: 24px;
                margin-bottom: 10px;
            }
            h4 {
                color: #555;
                font-size: 18px;
            }
            .order-details {
                font-size: 16px;
                background-color: #f0f8ff;
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
                line-height: 1.6;
            }
            p {
                color: #666;
                font-size: 16px;
                line-height: 1.8;
            }
            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #999;
            }
            .btn {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #007BFF;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
            }
            .btn:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hi ${name.split(" ").length > 1 ? name.split(" ")[0] : name},</h1>
            <p>Thank you for shopping with Thrivr! We're excited to let you know that we've received your order and it's being processed.</p>
            <h4>Order Details</h4>
            <div class="order-details">
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Items:</strong></p>
                <ul>
                    ${products
                      .map(
                        (item) =>
                          `<li>${item.name} - ₦${item.price}</li>`
                      )
                      .join("")}
                </ul>
                <p><strong>Total:</strong> ₦${total}</p>
            </div>
            <p>You'll receive another email as soon as your order ships. If you have any questions or need help, feel free to <a href="${`dhjdjdjk`}" class="btn">Contact Support</a>.</p>
            <div class="footer">
                Best regards,<br>
                The Thrivr Team
            </div>
        </div>
    </body>
    </html>
`,
    };

    transporter.sendMail(mailOptions, async (error: any, info: any) => {
      if (error) {
        console.log("error");
      } else {
        return true;
      }
    });
  } catch (error) {
    return "Error sending mail";
  }
};

const Actions: ActionsInterface = {
  addProduct: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    try {
      const {
        name,
        price,
        category,
        description,
        images,
        purchase_date,
        supplier,
      } = req.body as unknown as addProductRequest;
      const user = req.user;
      const business_id = user?.id;
  
      if (
        !user ||
        !name ||
        !price ||
        !category ||
        !description ||
        !purchase_date ||
        !supplier ||
        !business_id
      ) {
        return res.status(400).json({ error: "Bad request." });
      }
  
      if (user.role !== "business") {
        return res.status(401).json({ error: "Unauthorized access." });
      }
  
      const product = await Products.create({
        name,
        price,
        category,
        description,
        purchaseDate: purchase_date,
        supplier,
        business_id,
      });
  
      if (!product) {
        return res.status(500).json({ error: "Server error." });
      }
  
      let data = product.dataValues;
      data.images = [];
  
      if (images && images.length > 0) {
        const imageRecords = await Promise.all(
          images.map(async (file: string) => {
            return ProductImages.create({
              product_id: product.id,
              image_path: file,
            });
          })
        );
  
        data.images = imageRecords.map((img: ProductImages) => img.image_path);
      }
  
      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error." });
    }
  },
  

  getProduct: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      if (!id) {
        const user = req.user;
        const business_id = user.id;

        if (user.role != "business") {
          return res.status(401).json({ error: "Unauthorized access." });
        } else {
          if (!business_id) {
            return res.status(400).json({ error: "Bad request." });
          } else {
            const business = await Business.findOne();
            if (!business) {
              return res.status(404).json({ error: "Business does not exist" });
            } else {
              Products.findAll({
                where: { business_id: business_id },
                include: [
                  {
                    model: ProductImages,
                    required: false,
                  },
                ],
              }).then((fetchedProducts) => {
                if (fetchedProducts) {
                  return res
                    .status(200)
                    .json({ success: true, data: fetchedProducts });
                } else {
                  return res
                    .status(500)
                    .json({ error: "Error fetching products." });
                }
              });
            }
          }
        }
      } else {
        await Products.findOne({
          where: { id: id },
          include: [
            {
              model: ProductImages,
              required: false,
            },
            {
              model: Business,
              required: true,
              as: 'business',
              attributes: ['business_name', 'location', 'role', 'description', 'email', 'phone_number'],
            }
          ],
        }).then((product) => {
          if (!product) {
            return res.status(404).json({ error: "Product does not exist." });
          } else {
            return res.status(200).json({ success: true, data: product });
          }
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Server error." });
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
        return res.status(401).json({ error: "Unauthorized access." });
      } else {
        if (!id) {
          if (user.role != "business") {
            return res.status(401).json({ error: "Unauthorized access." });
          } else {
            const business = await Business.findOne({where: {id: business_id}});
            if (!business) {
              return res.status(404).json({ error: "Business does not exist" });
            } else {
              Orders.findAll({ where: { business_id: business_id },  }).then(
                (fetchedOrders) => {
                  if (fetchedOrders) {
                    return res
                      .status(200)
                      .json({ success: true, data: fetchedOrders });
                  } else {
                    return res
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
            include: [
              {
                model: Business,
                required: false,
                as: 'business',
                attributes: ['business_name', 'location', 'role', 'description', 'email', 'phone_number'],
              }
            ]
          }).then(async (order) => {
            if (!order) {
              return res.status(404).json({
                error: "The order you requested for does not exist. 😓",
              });
            } else {
              let newOrder = order.dataValues;
              const order_products = await orderProducts.findAll({
                where: { order_id: order.dataValues.id },
                attributes: ['product_id']
              });
              const productIds = order_products.map(item => item.product_id);
              const products = await Products.findAll({
                where: { id: { [Op.in]: productIds } }
              });

              newOrder.products = products;

              return res.status(200).json({ success: true, data: newOrder });
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error." });
    }
  },

  
  getSales: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    try {
      const user = req.user;
      const business_id = user.id;
      const { id } = req.params;

      if (!user || !business_id) {
        return res.status(401).json({ error: "Unauthorized access." });
      } else {
        if (!id) {
          if (user.role != "business") {
            return res.status(401).json({ error: "Unauthorized access." });
          } else {
            const business = await Business.findOne({where: {id: business_id}});
            if (!business) {
              return res.status(404).json({ error: "Business does not exist" });
            } else {
              Orders.findAll({ where: { business_id: business_id, payment_status: 'paid' },  }).then(
                (fetchedOrders) => {
                  if (fetchedOrders) {
                    return res
                      .status(200)
                      .json({ success: true, data: fetchedOrders });
                  } else {
                    return res
                      .status(500)
                      .json({ error: "Error fetching order details." });
                  }
                }
              );
            }
          }
        } else {
          await Orders.findOne({
            where: { id: id,  payment_status: 'paid' },
          }).then(async (order) => {
            if (!order) {
              return res.status(404).json({
                error: "The order you requested for does not exist. 😓",
              });
            } else {
              let newOrder = order.dataValues;
              const order_products = await orderProducts.findAll({
                where: { order_id: order.dataValues.id },
                attributes: ['product_id']
              });
              const productIds = order_products.map(item => item.product_id);
              const products = await Products.findAll({
                where: { id: { [Op.in]: productIds } }
              });

              newOrder.products = products;

              return res.status(200).json({ success: true, data: newOrder });
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error." });
    }
  },

  makeOrder: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    let {
      product_ids,
      customer_name,
      customers_contact,
      sales_channel,
      payment_channel,
      order_date,
      payment_status,
      note,
    } = req.body;
    const user = req.user;
    const business_id = user.id;

    if (!user || !business_id) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    product_ids = JSON.parse(product_ids);
    console.log(product_ids)
    if (
      !product_ids ||
      !customer_name ||
      !customers_contact ||
      !sales_channel ||
      !payment_channel ||
      !order_date ||
      !payment_status
    ) {
      return res.status(400).json({ error: "Bad request." });
    }

    Orders.create({
      business_id: business_id,
      customer_name: customer_name,
      customers_contact: customers_contact,
      sales_channel: sales_channel,
      payment_channel: payment_channel,
      order_date: order_date,
      payment_status: payment_status,
      note: note,
    })
      .then(async (order) => {
        let products: Products[] = [];
        await Promise.all(
          product_ids.map(async (product: Products, index: number) => {
            const productData = await Products.findOne({
              where: { id: product },
              include: [
                {
                  model: Business,
                  required: false,
                  as: 'business',
                  attributes: ['business_name', 'location', 'role', 'description', 'email', 'phone_number'],
                },
              ],
            });

            if(!productData){
              return res.status(404).json({error: 'Product does not exist.'})
            }
        
            products.push(productData?.dataValues);
            addToWallet(business_id, parseInt(productData?.dataValues.price));
          })
        );

        product_ids.forEach((product_id:any) => {
          orderProducts.create({
            order_id: order.dataValues.id,
            product_id: product_id
          });
        });

        productPurchaseMail(user.email, user.full_name, products, order.dataValues.id)
        return res
          .status(201)
          .json({ success: true, data: order.dataValues });
      })
      .catch((error) => {
        console.error(error)
        return res.status(500).json({ error: "Server error" });
      });
  },

  updateOrder: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const { id } = req.params;
    const { payment_status } = req.body;
    const user = req.user;
    const business_id = user.id;

    if (!user || !business_id) {
      return res.status(401).json({ eerroerror: "Unauthorized access." });
    }

    if (!id || !payment_status) {
      return res.status(400).json({ error: "Bad request." });
    }

    Orders.findOne({ where: { id: id } }).then((order) => {
      if (order?.payment_status == "paid") {
        return res
          .status(409)
          .json({ error: "conflict", message: "Order already paid for." });
      }
    });

    Orders.update({ payment_status: payment_status }, { where: { id: id } })
      .then((order) => {
        Orders.findOne({ where: { id: id } })
          .then((gotten_order) => {
            const product = Products.findOne({
              where: { id: (gotten_order as any)?.product_id },
            })
              .then((product) => {
                addToWallet(business_id, product?.price as any);
                return res
                  .status(200)
                  .json({ success: true, data: gotten_order });
              })
              .catch(() => {
                return res.status(500).json({ error: "Server error." });
              });
          })
          .catch(() => {
            return res.status(500).json({ error: "Server error" });
          });
      })
      .catch(() => {
        return res.status(500).json({ error: "Server error" });
      });
  },

  fetchBusiness: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const { id } = req.params;
    const user = req.user;
    const business_id = user.id;

    if (!user || !business_id) {
      return res.status(401).json({ eerroerror: "Unauthorized access." });
    }

    if (!id) {
      await Business.findOne({
        where: { id: business_id },
        include: [
          {
            model: Settings,
            required: false, // Optional; set to true if a related Settings record must exist
          },
          {
            model: Group,
            required: false, // Optional; set to true if a related Staff record must exist
          },
        ],
      })
        .then((business: any) => {
          if (business) {
            Products.findAll({ where: { business_id: id } })
              .then((products) => {
                const { password, createdAt, updatedAt, ...businessOut } =
                  business?.dataValues;
                businessOut.products = products;
                return res
                  .status(200)
                  .json({ success: true, data: businessOut });
              })
              .catch(() => {
                return res.status(500).json({
                  error: "Server error.",
                  message: "Error fetching details.",
                });
              });
          } else {
            return res.status(404).json({ error: "Business not found." });
          }
        })
        .catch(() => {
          return res.status(500).json({ error: "Server error" });
        });
    } else {
      await Business.findOne({
        where: { id: id },
        include: [
          {
            model: Settings,
            required: false, // Optional; set to true if a related Settings record must exist
          },
          {
            model: Group,
            required: false, // Optional; set to true if a related Staff record must exist
          },
        ],
      })
        .then((business: any) => {
          Products.findAll({ where: { business_id: id } })
            .then((products) => {
              const { password, createdAt, updatedAt, ...businessOut } =
                business?.dataValues;
              businessOut.products = products;
              BusinessStaffs.findOne({
                where: { email: user.email, business_id: id },
              }).then((staff) => {
                if (!staff) {
                  return res
                    .status(200)
                    .json({ success: true, data: businessOut });
                } else {
                  let values = staff.dataValues;
                  businessOut.isStaff = true;
                  businessOut.permissions = {
                    edit_products: values.products == true ? true : false,
                    can_manage_payments:
                      values.manage_payments == true ? true : false,
                    can_edit_store_settings:
                      values.store_settings == true ? true : false,
                    can_view_and_edit_orders:
                      values.order == true ? true : false,
                    can_view_and_Edit_customers:
                      values.customers == true ? true : false,
                    can_view_business_reports:
                      values.business_reports == true ? true : false,
                  };
                  return res
                    .status(200)
                    .json({ success: true, data: businessOut });
                }
              });
            })
            .catch(() => {
              return res.status(404).json({
                error: "Business not found.",
              });
            });
        })
        .catch(() => {
          return res.status(500).json({ error: "Server error" });
        });
    }
  },

  addTask: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const { title, details, due_date, time, reminder } = req.body;
    const user = req.user;
    const business_id = user.id;

    if (!title || !due_date || !time || !reminder) {
      return res.status(400).json({ error: "Bad request." });
    }

    if (!user || !business_id) {
      return res.status(401).json({ error: "Unauthorized access." });
    } else {
      Task.create({
        title: title,
        details: details,
        due_date: due_date,
        time: time,
        reminder: reminder,
        user_id: business_id,
      }).then((task) => {
        if (task) {
          return res.status(201).json({ sucess: true, data: task.dataValues });
        } else {
          return res.status(500).json({ error: "Server error." });
        }
      });
    }
  },

  getTasks: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const user = req.user;
    const business_id = user.id;
    const { id } = req.params;

    if (!user || !business_id) {
      return res.status(400).json({
        error: "Bad request.",
        message: "User Authentication failed.",
      });
    }

    if (!id) {
      Task.findAll({ where: { user_id: business_id } }).then((task) => {
        if (task) {
          return res.status(200).json({ success: true, data: task });
        } else {
          return res.status(500).json({ error: "Server error." });
        }
      });
    } else {
      Task.findOne({ where: { id: id } }).then((task) => {
        if (task) {
          return res.status(200).json({ success: true, data: task.dataValues });
        } else {
          return res.status(404).json({
            error: "task not found.",
            message: "Task does not exist.",
          });
        }
      });
    }
  },

  doTask: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const user = req.user;
    const business_id = user?.id; // Optional chaining to avoid errors if user is undefined
    const { id } = req.params;

    if (!user || !business_id) {
      return res.status(400).json({
        error: "Bad request.",
        message: "User or business ID not found.",
      });
    }

    if (!id) {
      return res
        .status(400)
        .json({ error: "Bad request.", message: "Task ID not specified." });
    }

    Task.update({ status: "completed" }, { where: { id: id } })
      .then(([rowsUpdated]) => {
        console.log(rowsUpdated);
        if (rowsUpdated > 0) {
          // Fetch the updated task
          Task.findOne({ where: { id: id } })
            .then((updatedTask) => {
              if (updatedTask) {
                return res
                  .status(200)
                  .json({ success: true, data: updatedTask });
              } else {
                return res.status(404).json({
                  error: "Task not found.",
                  message: "Task does not exist.",
                });
              }
            })
            .catch((err) => {
              return res.status(500).json({
                error: "Database error.",
                message: err.message,
              });
            });
        } else {
          return res.status(404).json({
            error: "Task not found.",
            message: "Task does not exist.",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          error: "Server error.",
          message: "Could not update task status.",
        });
      });
  },

  updateBusiness: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const user = req.user;
    const business_id = user?.id;

    const {
      full_name,
      business_name,
      location,
      email,
      phone_number,
      description,
      password,
      image_path
    } = req.body;

    if (!user || !business_id) {
      return res.status(400).json({
        error: "Bad request.",
        message: "User or business ID not found.",
      });
    }

    if (
      (full_name && full_name.length < 1) ||
      (business_name && business_name.length < 1) ||
      (location && location.length < 1) ||
      (email && email.length < 1) ||
      (phone_number && phone_number.length < 1) ||
      (description && description.length < 1) ||
      (password && password.length < 1)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid request. Fields cannot be empty." });
    }

    interface updateBusinessInterface {
      full_name?: string;
      business_name?: string;
      location?: string;
      email?: string;
      description?: string;
      phone_number?: string;
      password?: string;
      image_path?: any;
    }

    const updatedFields: updateBusinessInterface = {};
    if (full_name) updatedFields.full_name = full_name;
    if (business_name) updatedFields.business_name = business_name;
    if (location) updatedFields.location = location;
    if (email) updatedFields.email = email;
    if (phone_number) updatedFields.phone_number = phone_number;
    if (description) updatedFields.description = description;
    if (password) updatedFields.password = password;

    if (image_path) {
      updatedFields.image_path = image_path;
    }

    // Ensure there is at least one field to update
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: "No fields provided for update." });
    }

    // Perform the update
    try {
      await Business.update(updatedFields, {
        where: { id: business_id },
        returning: true,
      });

      const updatedUser = await Business.findOne({
        where: { id: business_id },
        attributes: [
          "full_name",
          "business_name",
          "location",
          "email",
          "phone_number",
          "description",
          "role",
          "image_path",
        ],
      });

      // Check if the user exists
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found." });
      }

      // Return the updated user data with the image URL
      return res.status(200).json({
        message: "Update successful.",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({ error: "Update failed." });
    }
  },

  updateBusinessSettings: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const user = req.user;
    const business_id = user?.id;

    const { theme, working_days, opening_hours, currency, image_path } =
      req.body;

    if (!user || !business_id) {
      return res.status(400).json({
        error: "Bad request.",
        message: "User or business ID not found.",
      });
    }

    if (
      (theme && theme.length < 1) ||
      (image_path && image_path.length < 1) ||
      (working_days && working_days.length < 1) ||
      (opening_hours && opening_hours.length < 1) ||
      (currency && currency.length < 1)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid request. Fields cannot be empty." });
    }

    interface updateBusinessInterface {
      theme?: string;
      working_days?: string;
      opening_hours?: string;
      currency?: string;
      banner_image?:string;
    }

    const updatedFields: updateBusinessInterface = {};
    if (theme) updatedFields.theme = theme;
    if (image_path) updatedFields.banner_image = image_path;
    if (working_days) updatedFields.working_days = working_days;
    if (opening_hours) updatedFields.opening_hours = opening_hours;
    if (currency) updatedFields.currency = currency;

    if (image_path) {
      updatedFields.banner_image = image_path;
    }

    // Ensure there is at least one field to update
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: "No fields provided for update." });
    }

    // Perform the update
    try {
      await Settings.update(updatedFields, {
        where: { id: business_id },
        returning: true,
      }).then(async () => {
        const updatedUser = await Business.findOne({
          where: { id: business_id },
          attributes: [
            "full_name",
            "business_name",
            "location",
            "email",
            "phone_number",
            "description",
            "role",
            "image_path",
          ],
          include: [
            {
              model: Settings,
              required: true, // Optional; set to true if you want to enforce that the Business must have Settings
            },
          ],
        })
          .then((updatedUser: any) => {
            // Check if the user exists
            if (!updatedUser) {
              return res.status(404).json({ error: "User not found." });
            }

            // Return the updated user data with the image URL
            return res.status(200).json({
              message: "Update successful.",
              user: updatedUser,
            });
          })
          .catch(() => {
            return res.status(500).json({ error: "Server error." });
          });
      });
    } catch (error) {
      return res.status(500).json({ error: "Update failed." });
    }
  },

  addCustomer: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const { name, email, phone_number, instagram, group } = req.body;
    const user = req.user;
    const business_id = user.id;

    if (!name || !email || !phone_number) {
      return res.status(400).json({ error: "Bad request." });
    }

    if (!user || !business_id) {
      return res.status(401).json({ error: "Unauthorized access." });
    } else {
      Customer.create({
        name: name,
        email: email,
        phone_number: phone_number,
        group: group,
        instagram: instagram ? instagram : "",
        business_id: business_id,
      }).then((customer) => {
        if (customer) {
          return res
            .status(201)
            .json({ sucess: true, data: customer.dataValues });
        } else {
          return res.status(500).json({ error: "Server error." });
        }
      });
    }
  },

  getCustomer: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const user = req.user;
    const business_id = user.id;
    const { id } = req.params;
    const group = req.query.group;

    if (!user || !business_id) {
      return res.status(400).json({
        error: "Bad request.",
        message: "User Authentication failed.",
      });
    }

    if (!id) {
      if (group) {
        Customer.findAll({
          where: { business_id: business_id, group: group },
        }).then((customer) => {
          if (customer) {
            return res.status(200).json({ success: true, data: customer });
          } else {
            return res.status(500).json({ error: "Server error." });
          }
        });
      } else {
        Customer.findAll({ where: { business_id: business_id } }).then(
          (customer) => {
            if (customer) {
              return res.status(200).json({ success: true, data: customer });
            } else {
              return res.status(500).json({ error: "Server error." });
            }
          }
        );
      }
    } else {
      Customer.findOne({ where: { id: id } }).then((customer) => {
        if (customer) {
          return res
            .status(200)
            .json({ success: true, data: customer.dataValues });
        } else {
          return res.status(404).json({
            error: "Customer not found.",
            message: "Customer does not exist.",
          });
        }
      });
    }
  },

  createGroup: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const { name } = req.body;
    const user = req.user;
    const business_id = user.id;

    if (!name) {
      return res.status(400).json({ error: "Bad request." });
    }

    if (!user || !business_id) {
      return res.status(401).json({ error: "Unauthorized access." });
    } else {
      Group.create({
        name: name,
        store_id: business_id,
      }).then((group) => {
        if (group) {
          return res.status(201).json({ sucess: true, data: group.dataValues });
        } else {
          return res.status(500).json({ error: "Server error." });
        }
      });
    }
  },

  addStaff: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const { name, email, role, permissions } = req.body;
    const user = req.user;
    const business_id = user.id;

    if (!name || !email || !role || !permissions) {
      return res.status(400).json({ error: "Bad request." });
    }

    if (!user || !business_id) {
      return res.status(401).json({ error: "Unauthorized access." });
    } else {
      BusinessStaffs.findOne({
        where: { email: email, business_id: business_id },
      }).then((staff) => {
        if (!staff) {
          const {
            products,
            manage_payments,
            edit_store_settings,
            order,
            customers,
            business_reports,
          } = JSON.parse(permissions);
          
          if(!products || !manage_payments || !edit_store_settings || !order || !customers || !business_reports)
            return res.status(400).json({error: 'Bad request.'});


          BusinessStaffs.create({
            name: name,
            email: email,
            role: role,
            products: products,
            manage_payments: manage_payments,
            store_settings: edit_store_settings,
            order: order,
            customers: customers,
            business_reports: business_reports,
            business_id: business_id,
          })
            .then((staff) => {
              return res
                .status(200)
                .json({ success: true, data: staff.dataValues });
            })
            .catch((error) => {
              console.log(error);
              return res.status(500).json({ error: "Server error." });
            });
        } else {
          return res.status(409).json({
            error: "Staff exists",
            message: "A staff with this email already exists.",
          });
        }
      });
    }
  },

  getDashboard: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const user = req.user;
    const business_id = user.id;

    if (!user || !business_id) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    Business.findOne({ where: { id: business_id } })
      .then(() => {})
      .catch(() => {
        return res.status(500).json({ error: "Server error." });
      });
  },

  deleteAccount: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const user = req.user;
    const business_id = user.id;

    if (!user || !business_id) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    Business.update({ deleted: true }, { where: { id: business_id } })
      .then(() => {
        return res
          .status(204)
          .json({ success: true, message: "Account deleted successfully" });
      })
      .catch(() => {
        return res.status(500).json({ error: "Server errror" });
      });
  },
};

export default Actions;
