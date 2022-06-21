const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phoneNum: String,
  password: String,
  nickname: String,
  userLocation: String,
  userImg: String,
  mannerOndo: String,
});

UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
