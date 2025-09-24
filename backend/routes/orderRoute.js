const express = require("express");
const router = express.Router();

const { create, index } = require("../controller/orderController");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/create", verifyToken, create);
router.get("/index", verifyToken, index);

module.exports = router;
