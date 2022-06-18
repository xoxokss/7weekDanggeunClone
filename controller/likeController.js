const Like = require("../models/like");
//좋아요 기능
async function clicklike(req, res) {
  console.log(d)
res.status(200);
}
//좋아요 취소 dd
async function clickbacklike(req, res) {
  const { nickname } = res.locals.user;
  const { postId } = req.params;
  const findLike = await Like.findByIdAndDelete({ postId, nickname });
  if (!findLike) {
    return res.status(400).send({ errorMessage: "err - you didn't clicked like" });
  }
    const likeNum = await Like.findById
    //포스트아이디로 찾아서 좋아요 갯수 카운트 해주기.
  res.status(200).json({ likeNum, msg: "좋아요 취소 완료!" });
}
module.exports.clicklike = clicklike;
module.exports.clickbacklike = clickbacklike;