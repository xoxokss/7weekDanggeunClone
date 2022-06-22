const Post = require("../models/post");
const Like = require("../models/like");
const User = require("../models/user");
const { findByIdAndUpdate } = require("../models/post");

// 게시글 전체 조회 API

async function allPost(req, res) {
  let posts = await Post.find().sort({ createdAt: "asc" }).exec();
  try {
    for (i = 0; i < posts.length; i++) {
      let post = posts[i];

      let postId = post.postId;
      console.log(postId);
      let likes = await Like.find({ PostId: postId });
      console.log(likes);
      let likeNum = 0;
      likeNum = +likes.length;
      Object.assign(post, { likeNum: likeNum, postsId: postId });

      console.log(post, likeNum, postId);
    }

    res.status(200).send({
      result: true,
      posts,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ result: false, errorMessage: "게시글 열람을 할 수 없습니다." });
  }
}

// 게시글 작성 API
// figma에는 지역을 사용자에게 입력받게 되어있는데, 사용자 정보(/user/me)로 갖고가는게 맞지않나?
async function writePost(req, res) {
  const { user } = res.locals; // JWT 인증 정보
  const { title, postImg, category, content, price } = req.body;
  console.log("작성 콘솔 : ", { user: user.userId });

  try {
    await Post.create({
      userId: user.userId,
      nickname: user.nickname,
      userLocation: user.userLocation, //유저 정보 불러와서 지역 작성하기로 고정
      title,
      category,
      postImg,
      content,
      price,
      tradeState: "0",
      likeNum: 0,
    });
    res.status(201).json({ result: true });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ result: false, errorMessage: "게시글 작성을 할 수 없습니다." });
  }
}

// 게시글 수정 API
async function updatePost(req, res) {
  try {
    const { user } = res.locals; // JWT 인증 정보
    const { postId } = req.params;
    const { title, postImg, category, content, price } = req.body;

    const existedPost = await Post.findById({ _id: postId }); // DB에서 postId가 같은 데이터 찾기
    if (user.userId !== existedPost.userId) {
      // 로그인 정보와 게시글 작성자가 같은지 확인
      res.json({
        result: false,
        message: "사용자가 작성한 게시글이 아닙니다.",
      });
    } else {
      await Post.findByIdAndUpdate(
        { _id: postId }, //해당 postId 찾아서 내용 수정
        {
          $set: {
            userId: user.userId,
            nickname: user.nickname,
            userLocation: user.userLocation,
            title,
            category,
            postImg,
            content,
            price,
          },
        }
      );
      res.status(200).json({ result: true, message: "게시글 수정 완료" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ result: false, errorMessage: "게시글 수정을 할 수 없습니다." });
  }
}

// 게시글 삭제 API
async function deletePost(req, res) {
  try {
    const { user } = res.locals; // JWT 인증 정보
    const { postId } = req.params;

    const existedPost = await Post.findById({ _id: postId }); // DB에서 postId가 같은 데이터 찾기
    if (user.userId !== existedPost.userId) {
      // 로그인 정보와 게시글 작성자가 같은지 확인
      res.json({
        result: false,
        message: "사용자가 작성한 게시글이 아닙니다.",
      });
    } else {
      await Like.findByIdAndDelete(postId); //해당 게시물 좋아요 DB 삭제
      await Post.findByIdAndDelete(postId);
      res.status(200).json({ result: true, message: "게시글 삭제 완료" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ result: false, errorMessage: "게시물 삭제를 할 수 없습니다." });
  }
}

// 게시글 상세 조회 API
async function getPostDetail(req, res) {
  const { user } = res.locals;
  const { postId } = req.params;

  const likeNum = Like.find({ postId: postId }).length; // Like DB안에 해당 postId 데이터베이스 갯수

  const likes = await Like.find({ postId: postId, userId: user.userId });
  const userLike = likes.length;

  console.log(userLike);

  try {
    const existPost = await Post.findById(postId);
    const postUser = await User.findById(existPost.userId); //게시글 작성자의 유저 정보 불러오기
    res.status(200).json({
      detailPost: {
        postId,
        title: existPost.title,
        content: existPost.content,
        postImg: existPost.postImg,
        nickname: existPost.nickname,
        userImg: postUser.userImg,
        userLocation: existPost.userLocation,
        mannerOndo: postUser.mannerOndo,
        price: existPost.price,
        category: existPost.category,
        likeNum: likeNum,
        userLike: userLike,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({
        err,
        result: false,
        errorMessage: "상세페이지를 확인할 수 없습니다",
      });
  }
}
async function updatatradeState(req, res) {
  const { category } = req.body;
  const { postId } = req.params;
  try {
    const postUser = await Post.findByIdAndUpdate(
      { postId: postId }, //해당 postId 찾아서 내용 수정
      {
        $set: { category: category },
      }
    );

    res.status(200).json({ result: true, message: "upload tradestate" });
  } catch (err) {
    res.status(400).json({
      err,
      result: false,
      errorMessage: "coudn't upload tradestate",
    });
  }
}
module.exports.allPost = allPost;

module.exports.writePost = writePost;
module.exports.getPostDetail = getPostDetail;
module.exports.updatePost = updatePost;
module.exports.deletePost = deletePost;
module.exports.updatatradeState = updatatradeState;
