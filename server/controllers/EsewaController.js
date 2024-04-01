const crypto = require("crypto");
const Order = require("../model/Order");

class EsewController {
  create_Signature = (message) => {
    try {
      const secret = "8gBm/:&EnhH.1/q";
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(message);

      /* Get the digest in base64 format */
      const hashInBase64 = hmac.digest("base64");
      console.log(hashInBase64);
      return hashInBase64;
    } catch (error) {
      return "";
    }
  };

  createSignature = (message) => {
    const secret = "8gBm/:&EnhH.1/q"; //different in production
    // Create an HMAC-SHA256 hash
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);

    // Get the digest in base64 format
    const hashInBase64 = hmac.digest("base64");
    return hashInBase64;
  };

  getOrders = async (req, res) => {
    try {
      const orders = await Order.find();
      return res.json({ status: true, message: orders });
    } catch (error) {
      return res.json({ status: false, message: error.message });
    }
  };
  getSignature = async (req, res) => {
    try {
      const dataString = req.body;
      return res.json({ sig: this.createSignature(dataString) });
    } catch (error) {
      
    }
  };

  create_Order = async (req, res) => {
    try {
      if (!req.body) throw new Error("All fields required");
      const newOrder = new Order(req.body);
      const order = await newOrder.save();
      const signature = this.createSignature(
        `total_amount=${order.amount},transaction_uuid=${order._id},product_code=EPAYTEST`
      );
      const formData = {
        amount: order.amount,
        failure_url: "https://google.com",
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: "EPAYTEST",
        signature: signature,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        success_url: "http://192.168.50.251:9000/api/esewa/success",
        tax_amount: "0",
        total_amount: order.amount,
        transaction_uuid: order.id,
      };
      return res.json({ status: true, formData });
    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  };

  successTes = async (req, res) => {
    return res.status(200).json({ status: true, message: "payment approved" });
  };

  updateOrderAfterPayment = async (req, res) => {
    try {
      console.log(req.body);
      const order = await Order.findById(req.transaction_uuid);
      order.status = "paid";
      order.transaction_code = req.transaction_code;
      const orderupdated = await order.save();
      console.log({ orderupdated });
      res.redirect("http://192.168.50.251:3000");
      //   return res.json({ status: true, message: "sucess" });
    } catch (err) {
      return res.status(400).json({ error: err?.message || "No Orders found" });
    }
  };
}

const esewacontroller = new EsewController();
module.exports.esewacontroller = esewacontroller;
