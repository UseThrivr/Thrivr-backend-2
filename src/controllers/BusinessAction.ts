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

interface addProductRequest {
  name: string;
  price: string;
  category: string;
  description: string;
  purchase_date: string;
  supplier: string;
  logos?: any;
}

interface afterBusinessVerificationMiddleware {
  user: { id?: number; role?: string, email ?:string };
}

interface ActionsInterface {
  addProduct: Function;
  getProduct: Function;
  getOrder: Function;
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
}

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
        logos,
        purchase_date,
        supplier,
      } = req.body as unknown as addProductRequest;
      const user = req.user;
      const business_id = user.id;
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
            purchaseDate: purchase_date,
            supplier: supplier,
            business_id: user.id,
          }).then((product) => {
            if (product) {
              if ((req as any).files && (req as any).files.length > 0) {
                (req as any).files.map((file: any) => {
                  ProductImages.create({
                    product_id: product.id,
                    image_path: file.location,
                  });
                });
              }
            } else {
              return res.status(500).json({ error: "Server error." });
            }
            return res.status(201).json({
              success: true,
              message: "Product created successfully",
            });
          });
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Server error.", error_: "after" });
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
          res.status(401).json({ error: "Unauthorized access." });
        } else {
          if (!business_id) {
            res.status(400).json({ error: "Bad request." });
          } else {
            const business = await Business.findOne();
            if (!business) {
              res.status(404).json({ error: "Business does not exist" });
            } else {
              Products.findAll({
                where: { business_id: business_id },
                include: [
                  {
                    model: ProductImages,
                    as: "images", // This will give an alias to the associated images
                    required: false, // Make this false to avoid excluding products without images
                  },
                ],
              }).then((fetchedProducts) => {
                if (fetchedProducts) {
                  res
                    .status(200)
                    .json({ success: true, data: fetchedProducts });
                } else {
                  res.status(500).json({ error: "Error fetching products." });
                }
              });
            }
          }
        }
      } else {
        await Products.findAll({
          where: { id: id },
          include: [
            {
              model: ProductImages,
              required: true,
            },
          ],
        }).then((product) => {
          if (!product || product.length < 1) {
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

  fetchBusiness: async (req: Request & afterBusinessVerificationMiddleware, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const business_id = user.id;

    if(!user || !business_id){
      return res.status(401).json({eerroerror: 'Unauthorized access.'});
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
        .then((business) => {
          Products.findAll({where: {business_id: id}}).then((products) => {
            const { password, createdAt, updatedAt, ...businessOut } =
            business?.dataValues;
            businessOut.products = products;
            res.status(200).json({ success: true, data: businessOut });
          }).catch(() =>{
            res.status(500).json({error: 'Server error.', message: 'Error fetching details.'});
          })
        })
        .catch(() => {
          res.status(500).json({ error: "Server error" });
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
        .then((business) => {
          Products.findAll({where: {business_id: id}}).then((products) => {
            const { password, createdAt, updatedAt, ...businessOut } =
            business?.dataValues;
            businessOut.products = products;
            BusinessStaffs.findOne({
              where: {email: user.email, business_id: id}
            }).then((staff) => {
              if(!staff){
                res.status(200).json({ success: true, data: businessOut });
              }
              else{
                let values = staff.dataValues;
                businessOut.isStaff = true;
                businessOut.permissions = {
                  edit_products: values.products == true ? true: false,
                  can_manage_payments: values.manage_payments == true ? true: false,
                  can_edit_store_settings: values.store_settings == true ? true: false,
                  can_view_and_edit_orders: values.order == true ? true: false,
                  can_view_and_Edit_customers: values.customers == true ? true: false,
                  can_view_business_reports: values.business_reports == true ? true: false
                }
                res.status(200).json({ success: true, data: businessOut });
              }
            })
          }).catch(() =>{
            res.status(500).json({error: 'Server error.', message: 'Error fetching details.'});
          })
        })
        .catch(() => {
          res.status(500).json({ error: "Server error" });
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
      res.status(400).json({ error: "Bad request." });
    }

    if (!user || !business_id) {
      res.status(401).json({ error: "Unauthorized access." });
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
          res.status(201).json({ sucess: true, data: task.dataValues });
        } else {
          res.status(500).json({ error: "Server error." });
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
      res.status(400).json({
        error: "Bad request.",
        message: "User Authentication failed.",
      });
    }

    if (!id) {
      Task.findAll({ where: { user_id: business_id } }).then((task) => {
        if (task) {
          res.status(200).json({ success: true, data: task });
        } else {
          res.status(500).json({ error: "Server error." });
        }
      });
    } else {
      Task.findOne({ where: { id: id } }).then((task) => {
        if (task) {
          res.status(200).json({ success: true, data: task.dataValues });
        } else {
          res.status(404).json({
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
      logo,
      password,
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

    if ((req as any).file) {
      updatedFields.image_path = (req as any).file.location;
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
      res.status(500).json({ error: "Update failed." });
    }
  },

  updateBusinessSettings: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const user = req.user;
    const business_id = user?.id;

    const { theme, banner_image, working_days, opening_hours, currency } =
      req.body;

    if (!user || !business_id) {
      return res.status(400).json({
        error: "Bad request.",
        message: "User or business ID not found.",
      });
    }

    if (
      (theme && theme.length < 1) ||
      (banner_image && banner_image.length < 1) ||
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
      banner_image?: string;
      working_days?: string;
      opening_hours?: string;
      currency?: string;
    }

    const updatedFields: updateBusinessInterface = {};
    if (theme) updatedFields.theme = theme;
    if (banner_image) updatedFields.banner_image = banner_image;
    if (working_days) updatedFields.working_days = working_days;
    if (opening_hours) updatedFields.opening_hours = opening_hours;
    if (currency) updatedFields.currency = currency;

    if ((req as any).file) {
      updatedFields.banner_image = (req as any).file.location;
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
      });
    } catch (error) {
      res.status(500).json({ error: "Update failed." });
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
          res.status(201).json({ sucess: true, data: customer.dataValues });
        } else {
          res.status(500).json({ error: "Server error." });
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
          where: { user_id: business_id, group: group },
        }).then((customer) => {
          if (customer) {
            return res.status(200).json({ success: true, data: customer });
          } else {
            return res.status(500).json({ error: "Server error." });
          }
        });
      } else {
        Customer.findAll({ where: { user_id: business_id } }).then(
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
            error: "task not found.",
            message: "Task does not exist.",
          });
        }
      });
    }
  },

  createGroup: async (
    req: Request & afterBusinessVerificationMiddleware,
    res: Response
  ) => {
    const { name, email, phone_number, instagram, group } = req.body;
    const user = req.user;
    const business_id = user.id;

    if (!name) {
      res.status(400).json({ error: "Bad request." });
    }

    if (!user || !business_id) {
      res.status(401).json({ error: "Unauthorized access." });
    } else {
      Group.create({
        name: name,
        store_id: business_id,
      }).then((group) => {
        if (group) {
          res.status(201).json({ sucess: true, data: group.dataValues });
        } else {
          res.status(500).json({ error: "Server error." });
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
      BusinessStaffs.findOne({where: {email: email, business_id: business_id}}).then((staff) => {
          if(!staff){
            const {products, manage_payments, store_settings, order, customers, business_reports} = permissions;
            BusinessStaffs.create({
              name: name,
              email: email,
              role: role,
              products: products,
              manage_payments: manage_payments,
              store_settings: store_settings,
              order: order,
              customers: customers,
              business_reports: business_reports
            }).then(staff =>{
              return res.status(200).json({success: true, data: staff.dataValues});
            }).catch(() => {
              return res.status(500).json({error: 'Server error.'});
            })
          }
          else{
            return res.status(409).json({error: 'Staff exists', message: 'A staff with this email already exists.'});
          }
      });
      
    }
  },
};

export default Actions;
