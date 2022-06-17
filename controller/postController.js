const Post = require("../models/post");
const Like = require("../models/like");

// 게시글 전체 조회 API
// 요구사항 : 지역으로 filter, 시간순으로 sort
async function allPost(req, res) {
  const { user } = res.locals;
  // const { page } = req.query; //무한스크롤용 쿼리값인듯

  const userLocation = user.userLocation;
  const posts = await Post.find({ userLocation }).sort({ CreateAt: "desc" });
  // .skip(page)
  // .limit(4); //무한스크롤 때문에 4개씩 페이지를 끊어주는 듯하다.

  res.status(200).json(userLocation, posts);
}

// 게시글 작성 API
async function writePost(req, res) {
  res.status(200);
}

// 게시글 수정 API
async function updatePost(req, res) {
  res.status(200);
}

// 게시글 삭제 API
async function deletePost(req, res) {
  res.status(200);
}

// 게시글 상세 조회 API
async function getPostDetail(req, res) {
  res.status(200);
}

module.exports.allPost = allPost;
module.exports.writePost = writePost;
module.exports.getPostDetail = getPostDetail;
module.exports.updatePost = updatePost;
module.exports.deletePost = deletePost;
