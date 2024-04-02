const express = require("express");
const { esewacontrollerV1 } = require("../controllers/EsewaControllerV1");
const router = express.Router();

/* CREATE  ORDER */
router.route("/createorderv1").post(esewacontrollerV1.createOrder);
/* FETCH ALL THE ORDERS */
router.route("/getordersv1").get(esewacontrollerV1.getOrders);
/* Handle Sucess */
router.route("/successv1").get(esewacontrollerV1.handleSucess)
/* Handle failurev1 */
router.route("/failurev1").get(esewacontrollerV1.handleFailure)

module.exports = router;
