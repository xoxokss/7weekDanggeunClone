const Like = require("../models/like");

//좋아요 기능
async function onlike(req, res) {
  const { userId } = res.locals.user;
  const { postId } = req.params;

  const dolike = await Like.create({ userId, postId: postId });

  if (!dolike) {
    res.status(400).send({ errorMessage: "you already clicked once" });
    return;
  }
  const likes = await Like.find({ postId });
  const likeNum = likes.length;

  res.status(200).send({ likeNum, message: "like Complete" });
}

//좋아요 취소
async function unlike(req, res) {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  console.log(userId, postId);
  const delmylike = await Like.findOneAndDelete({ postId, userId });

  if (!delmylike) {
    res.status(400).send({ errorMessage: "you didnt click like" });
    return;
  }
  const likes = await Like.find({ postId });
  const likeNum = likes.length;

  res.status(200).send({ likeNum, msg: "unlike Complete" });
}

module.exports.onlike = onlike;
module.exports.unlike = unlike;
