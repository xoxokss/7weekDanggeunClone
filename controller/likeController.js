const Like = require("../models/like");

async function clicklike(req, res) {
  res.status(200);
}

async function clickbacklike(req, res) {
  const { nickname } = res.locals.user;
  const { postId } = req.params;
  const findLike = await Like.findByIdAndDelete({ postId, nickname });
  if (!findLike) {
    return res
      .status(400)
      .send({ errorMessage: "err - you didn't clicked like" });
  }
  const likeNum = await Like.findById;
  
  res.status(200).json({ likeNum, msg: "좋아요 취소 완료!" });
}
module.exports.clicklike = clicklike;
module.exports.clickbacklike = clickbacklike;


//좋아요 기능
async function like(req, res) {
  const { nickname } = res.locals.user;
  const { postId } = req.param;
  

  
  const like = new like({ nickname, postId });

 
  const { likeNum } = Object.keys(await Like.find(postId, nickname)); //+1
 
  console.log(likeNum);
  res.status(200).send({ likeNum, message: "like Complete" });
}

//좋아요 취소
async function unlike(req, res) {
  const { nickname } = res.locals.user;
  const { postId } = req.params;

  const findLike = await Like.findByIdAndDelete({ postId, nickname });


  const { likeNum } = Object.keys(await Like.find(postId, nickname));
  
  console.log(likeNum);
  res.status(200).send({ likeNum, msg: "unlike Complete" });
}

module.exports.like = like;
module.exports.unlike = unlike;
