const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  userId: String,
  postId: String,
});

LikeSchema.virtual("likeId").get(function () {
  return this._id.toHexString();
});
LikeSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Like", LikeSchema);
