const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  phoneNum: Number,
  password: String,
  nickname: String,
  userLocation: String,
  mannerOndo: Number,
});
//sellList , boughtList
UserSchema.virtual("userId").get(function() {
    return this._id.toHexString();
});
UserSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("User", UserSchema);
//마이페이지