const Like = require("../models/like");
const Post = require("../models/post");

//좋아요 기능
async function onlike(req, res) {
  const { user } = res.locals;
  const { postId } = req.params; //24자 HexString인지 확인용

  //이미 좋아요를 누른 글인 경우 막는다. 
  const likeDone = await Like.findOne({
    userId: user.userId,
    postId: postId,
  }).exec();
  console.log(likeDone);
  if (likeDone) {
    res
      .status(400)
      .send({ result: false, message: "이미 관심 목록에 있습니다." });
    return;
  }

  //게시물을 보고 있는 중에 글이 삭제 됐을 경우 사용자가 좋아요를 못누르게 한다.
  const existedPost = await Post.findById(postId);
  if (!existedPost) {
    res
      .status(400)
      .send({ result: false, message: "존재하지 않는 판매 게시물입니다." });
  }
  await Like.create({ userId: user.userId, postId: postId });

  // 해당 게시글 좋아요 개수 다시 출력해주기 (갱신)
  const likes = await Like.find({ postId });
  const likeNum = likes.length;

  res
    .status(200)
    .send({ likeNum, result: true, message: "관심 목록에 추가되었어요." });
}

//좋아요 취소
async function unlike(req, res) {
  const { user } = res.locals;
  const { postId } = req.params;

  const delmylike = await Like.findOneAndDelete({
    postId: postId,
    userId: user.userId,
  });
  //이미 취소된 좋아요를 막는다.
  if (!delmylike) {
    res
      .status(400)
      .send({ result: false, message: "이미 관심목록에서 제외되어 있습니다." });
    return;
  }
  const likes = await Like.find({ postId });
  const likeNum = likes.length;

  res
    .status(200)
    .send({ likeNum, result: true, message: "관심 목록에서 제외합니다." });
}

module.exports.onlike = onlike;
module.exports.unlike = unlike;
