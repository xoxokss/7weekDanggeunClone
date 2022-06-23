const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    postId: String,

    userId: {
      String,
      required: true,
    },
    nickname: {
      String,
      required: true,
    },
    postImg: String,
    title: {
      String,
      required: true,
    },
    category: String,
    content: {
      String,
      required: true,
    },
    userLocation: {
      String,
      required: true,
    },
    // createdAt: { type: Date, default: Date.now }, //수동으로 날짜 생성하기, 날짜 UTC+8하는 방법 찾기
    price: String,
    tradeState: String, //(판매중=0, 거래중=1, 거래완료=2)
    likeNum: Number,
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
