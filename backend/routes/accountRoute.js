const { Router } = require("express");
const { 
  getAccountData, 
  updateAccountData 
} = require("../controller/accountController");

const router = Router();

// Routes for account data management
router.get("/", getAccountData);
router.put("/", updateAccountData);

module.exports = router;