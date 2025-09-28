const Account = require("../model/AccountModel");

// Get account data
const getAccountData = async (req, res) => {
  try {
    let data = await Account.findOne();
    
    if (!data) {
      // Create default data if it doesn't exist
      data = new Account();
      await data.save();
    }
    
    res.json(data);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: "Error fetching account data: " + error.message });
  }
};

// Update account data
const updateAccountData = async (req, res) => {
  try {
    const { personal, demat, verifiedPL } = req.body;
    
    let data = await Account.findOne();
    if (!data) {
      data = new Account();
    }
    
    // Update the data
    if (personal) data.personal = { ...data.personal, ...personal };
    if (demat) data.demat = { ...data.demat, ...demat };
    if (verifiedPL) data.verifiedPL = { ...data.verifiedPL, ...verifiedPL };
    
    await data.save();
    res.json(data);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: "Error updating account data: " + error.message });
  }
};

module.exports = {
  getAccountData,
  updateAccountData
};