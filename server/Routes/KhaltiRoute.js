const express = require("express");
const { esewacontroller } = require("../controllers/EsewaController");
const { esewaMiddleware } = require("../controllers/EsewaMiddleWare");
const router = express.Router();

/* CREATE A REQUEST */
router.route("/createorder").post(esewacontroller.create_Order);

router.route("/getorders").get(esewacontroller.getOrders);


module.exports = router;
