const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/verifyToken");

const { index, addPosition } = require("../controller/positionsController");

router.get("/index", verifyToken, index);
router.post("/add", addPosition);

module.exports = router;
