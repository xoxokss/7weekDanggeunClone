const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId :String,
    nickname : String,
    postImg: String,
    title: String,
    category: String,
    content: String,
    userLocation: String,
    // createdAt: { type: Date, default: Date.now }, //수동으로 날짜 생성하기, 날짜 UTC+8하는 방법 찾기
    price: String,
    tradeState: String, //(판매중=0, 거래중=1, 거래완료=2)
   
  },
  {
    timestamps: true,
  }
);

PostSchema.virtual('postId').get(function () {
  return this._id.toHexString();
});
PostSchema.set('toJSON', { virtual: true });

module.exports = mongoose.model('Post', PostSchema);
