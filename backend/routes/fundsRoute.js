const { Router } = require("express");
const { getFunds, updateFunds } = require("../controller/fundsController");

const router = Router();

router.get("/", getFunds);
router.put("/", updateFunds);

module.exports = router;