const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  nickname: String,
  postId: String,
});

LikeSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
LikeSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Like", LikeSchema);
