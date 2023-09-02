// {
//   title: 'avatar',
//   year: '2022',
//   score: '7',
//   adult: 'false'
// }

const { Schema, model } = require("mongoose");

const filmSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "DB: title is required"],
    },
    year: {
      type: Number,
      default: 2000,
    },
    score: {
      type: Number,
      default: 0.0,
    },
    adult: {
      type: Boolean,
      required: [true, "DB: adult is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("film", filmSchema);
