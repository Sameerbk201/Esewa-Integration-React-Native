const crypto = require("crypto");
const Order = require("../model/Order");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");

class KhaltiControllerV1 {
  constructor() {
    this.key = ``;
  }
  createOrder = async (req, res) => {
    try {
      if (!req.body) throw new Error("All fields required");
      console.log(req.body);
      const newOrder = new Order(req.body);
      const order = await newOrder.save();

      /* Create FormData As Mentioned In the documentation */
      const formData = {
        return_url: `${process.env.BACKEND_URL}/api/khaltiv1/successv1`,
        website_url: `${process.env.FRONTEND_URL}/khalti`,
        amount: order.amount * 100, //paisa
        purchase_order_id: order._id,
        purchase_order_name: "test",
      };
      const headers = {
        Authorization: `Key ${this.key}`,
        "Content-Type": "application/json",
      };
      console.log(headers);

      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        formData,
        {
          headers,
        }
      );
      console.log(`[+] Khalti`);
      console.log(response.data);
      console.log(response.data.payment_url);

      return res.json({
        status: true,
        message: {
          message: "khalti success",
          payment_method: "khalti",
          data: response.data,
        },
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, message: error.message });
    }
  };

  getOrders = async (req, res) => {
    try {
      const orders = await Order.find().sort({ updatedAt: -1 });
      return res.json({ status: true, message: orders });
    } catch (error) {
      return res.json({ status: true, message: error.message });
    }
  };

  handleSuccess = async (req, res, next) => {
    try {
      const {
        txnId,
        pidx,
        amount,
        purchase_order_id,
        transaction_id,
        message,
      } = req.query;
      if (message) {
        console.log(`Error Processing Khalti`);
        return res.redirect(process.env.FRONTEND_URL + "/esewapaymentfailure");
        // return res
        //   .status(400)
        //   .json({ error: message || "Error Processing Khalti" });
      }

      const headers = {
        Authorization: `Key ${this.key}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/lookup/",
        { pidx },
        { headers }
      );
      console.log(`[+] Khalit check`);
      console.log(response.data);
      if (response.data.status !== "Completed") {
        console.log(`Payment not completed`);
        return res.status(400).json({ error: "Payment not completed" });
      }

      console.log(purchase_order_id, pidx);
      const transaction_uuid = purchase_order_id;
      const transaction_code = pidx;

      const order = await Order.findById(transaction_uuid);
      order.status = "paid";
      order.payment_method = "khalti";
      order.transaction_code = transaction_code;
      const orderupdated = await order.save();
      return res.redirect(process.env.FRONTEND_URL + "/khalti");
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ error: err?.message || "Error Processing Khalti" });
    }
  };

  handleFailure = async (req, res) => {
    return res.redirect(process.env.FRONTEND_URL + "/esewapaymentfailure");
  };
}

const KhaltiControllerv1 = new KhaltiControllerV1();
module.exports.KhaltiControllerv1 = KhaltiControllerv1;
