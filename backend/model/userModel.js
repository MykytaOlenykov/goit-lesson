const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "DB: email is required"],
    },
    password: {
      type: String,
      required: [true, "DB: password is required"],
    },
    name: {
      type: String,
      default: "Tolik",
    },
    verifyEmail: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    roles: [
      {
        type: String,
        ref: "role",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("user", userSchema);
