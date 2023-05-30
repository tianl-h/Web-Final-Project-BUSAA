// This code defines a Mongoose schema for message exports a model for it
const mongoose = require("mongoose");
// Defines the message schema with properties content, userName, user
const messageSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
