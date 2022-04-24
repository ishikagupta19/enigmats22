const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type:Number,
      required: true,
    },
    collegename: {
      type:String,
      required: true,
    },
    branch: {
      type:String,
      required: true,
    },
    year: {
      type:String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cpassword: {
      type: String,
      required: true,
    },
    level: {
      type:Number,
      default: 1,
      unique:false
    },
  },{
    timestamps:true
  }
);

module.exports = mongoose.model("Users", userSchema);
