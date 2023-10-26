const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    // Add more fields as needed
  },
  {
    timestamps: true, // Automatically add "createdAt" and "updatedAt" fields
  }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
