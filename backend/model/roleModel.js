const { Schema, model } = require("mongoose");

const roleSchema = new Schema(
  {
    value: {
      type: String,
      default: "USER",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("role", roleSchema);
