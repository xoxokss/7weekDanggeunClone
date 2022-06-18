const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phoneNum: {
    type: String,

    trim: true,
  },
  password: {
    type: String,
    minLength: 3,
    trim: true,

    // match: [
    //   /[A-Za-z0-9_]{4,16}/,],
  },
  nickname: {
    type: String,
    trim: true,

    match: [/[가-힣A-Zㄱ-ㅎa-z0-9_]{4,16}/],
  },
  userLocation: String,
  userImg: String,
  mannerOndo: Number,
});

UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);

//마이페이지
