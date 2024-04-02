const crypto = require("crypto");
const Order = require("../model/Order");
const dotenv = require("dotenv");
const { esewaUtil } = require("../Utils/EsewaUtil");
dotenv.config();

class EsewaControllerV1 {
  createOrder = async (req, res) => {
    try {
      if (!req.body) throw new Error("All fields required");
      console.log(req.body);
      const newOrder = new Order(req.body);
      const order = await newOrder.save();
      /* Create signature as mentioned in the documentation */
      const signature = esewaUtil.createEsewaSignature(
        `total_amount=${order.amount},transaction_uuid=${order._id},product_code=EPAYTEST`
      );
      /* Create FormData As Mentioned In the documentation */
      const formData = {
        amount: order.amount,
        failure_url: `${process.env.BACKEND_URL}/api/esewav1/failurev1`,
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: "EPAYTEST",
        signature: signature,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        success_url: `${process.env.BACKEND_URL}/api/esewav1/successv1`,
        tax_amount: "0",
        total_amount: order.amount,
        transaction_uuid: order.id,
      };
      return res.json({ status: true, message: formData });
    } catch (error) {
      return res.json({ status: false, message: error.message });
    }
  };

  getOrders = async (req, res) => {
    try {
      const orders = await Order.find();
      return res.json({ status: true, message: orders });
    } catch (error) {
      return res.json({ status: true, message: error.message });
    }
  };

  handleSucess = async (req, res) => {
    try {
      /* Try To create a middleware for this  */
      const { data } = req.query;
      const decodedData = JSON.parse(
        Buffer.from(data, "base64").toString("utf-8")
      );
      console.log({ decodedData });
      if (decodedData.status !== "COMPLETE") {
        return res.status(400).json({ status: false, message: "NOT_COMPLETE" });
      }
      const message = decodedData.signed_field_names
        .split(",")
        .map((field) => `${field}=${decodedData[field] || ""}`)
        .join(",");
      console.log({ message, decodedData });
      const signature = esewaUtil.createEsewaSignature(message);
      if (signature !== decodedData.signature) {
        throw new Error("Integrity Error");
      }
      const transaction_uuid = decodedData.transaction_uuid;
      const transaction_code = decodedData.transaction_code;

      /* Till above implement a middle ware this is just for testing */
      const order = await Order.findById(transaction_uuid);
      order.status = "paid";
      order.transaction_code = transaction_code;
      const orderupdated = await order.save();
      return res.redirect(process.env.FRONTEND_URL + "/esewa");
    } catch (error) {
      return res.json({ status: true, message: error.message });
    }
  };
  handleFailure = async (req, res) => {
    return res.redirect(process.env.FRONTEND_URL+'/esewapaymentfailure');
  };
}

const esewacontrollerV1 = new EsewaControllerV1();
module.exports.esewacontrollerV1 = esewacontrollerV1;
