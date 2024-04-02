const express = require("express");
const { KhaltiControllerv1 } = require("../controllers/KhaltiControllerV1");
const router = express.Router();

/* CREATE  ORDER */
router.route("/createorderv1").post(KhaltiControllerv1.createOrder);
/* FETCH ALL THE ORDERS */
router.route("/getordersv1").get(KhaltiControllerv1.getOrders);
/* Handle Sucess */
router.route("/successv1").get(KhaltiControllerv1.handleSuccess)
/* Handle failurev1 */
router.route("/failurev1").get(KhaltiControllerv1.handleFailure)

module.exports = router;
