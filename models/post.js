const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    postImg: String,
    title: String,
    category: String,
    content: String,
    userLocation: String,
    // createdAt: { type: Date, default: Date.now }, //수동으로 날짜생성하기
    price: Number,
    likeNum: Number,
    tradeState: Number, //(판매중=0, 거래중=1, 거래완료=2)
  },
  {
    timestamps: true,
  }
);

// PostSchema.virtual('postId').get(function () {
//   return this._id.toHexString();
// });
// PostSchema.set('toJSON', { virtual: true });

module.exports = mongoose.model('Post', PostSchema);
