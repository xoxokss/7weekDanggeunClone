const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  phoneNum: Number,
  password: String,
  nickname: String,
  userLocation: String,
  mannerOndo: Number,
  userId: String,
});
//sellList , boughtList
UserSchema.virtual("authorId").get(function() {
    return this._id.toHexString();
});
UserSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("User", UserSchema);
//마이페이지