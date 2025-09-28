const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  personal: {
    email: {
      type: String,
      default: "SAHADSAAD186@GMAIL.COM"
    },
    mobile: {
      type: String,
      default: "*6950"
    },
    pan: {
      type: String,
      default: "*182M"
    }
  },
  demat: {
    dematId: {
      type: String,
      default: "1208160149854261"
    },
    dpId: {
      type: String,  
      default: "12081601"
    },
    boId: {
      type: String,
      default: "49854261"
    },
    depositoryParticipant: {
      type: String,
      default: "Zerodha Broking Limited"
    },
    depository: {
      type: String,
      default: "CDSL"
    }
  },
  verifiedPL: {
    nameDisplay: {
      type: String,
      default: "Full name"
    },
    useAvatar: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: ""
    },
    personalWebpage: {
      type: String,
      default: ""
    },
    segments: {
      equity: {
        type: Boolean,
        default: false
      },
      currency: {
        type: Boolean,
        default: false
      },
      futuresOptions: {
        type: Boolean,
        default: false
      },
      commodity: {
        type: Boolean,
        default: false
      }
    },
    livePL: {
      type: Boolean,
      default: false
    },
    timelineDays: {
      type: Number,
      default: 30
    },
    displayTrades: {
      type: Boolean,
      default: true
    }
  }
});

module.exports = mongoose.model("Account", AccountSchema);