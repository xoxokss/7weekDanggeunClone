const mongoose = require("mongoose");
const LikeSchema = new mongoose.Schema({
});
//sellList , boughtList
LikeSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
LikeSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Like", LikeSchema);
//마이페이지
