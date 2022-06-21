const Post = require("../models/post");
const Like = require("../models/like");
const User = require("../models/user");

// 게시글 전체 조회 API

async function allPost(req, res) {
  let posts = await Post.find().sort({ createdAt: "asc" }).exec();

  for (i = 0; i < posts.length; i++) {
    let post = posts[i];

    let postId = post.postId;
    let likes = await Like.find({ postId: postId });

    let likeNum = likes.length;
    Object.assign(post, { likeNum: likeNum });
  }

  res.status(200).send({
    result: true,
    posts : posts.map((a)=>({
      postId:a._id,
      userLocation:a.userLocation,
      title: a.title,
      price : a.price,
      postImg : a.postImg,
      likeNum : a.likeNum,
      createdAt : a.createdAt
    })),
  });
}

// 전체게시글 조회 연습 지우지마세요.
async function allPost2(req, res) {
  const Posts = await Post.find().sort({ createdAt: "asc" }).exec();
  // console.log(Posts) //  Posts = [{게시글1}, {게시글2}, {게시글3}]
  const postsWithLike = [];
  let likes = [];
  for (i = 0; i < Posts.length; i++) {
    likes = await Like.find({ postId: Posts[i].postId });
    postsWithLike.push();
  }
  console.log(likes);
  res.status(200).send({ result: "hello" });
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
    res.status(400).json({ result: false });
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
    res.status(400).json({ result: false });
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
    res.status(400).json({ result: false });
  }
}

// 게시글 상세 조회 API
async function getPostDetail(req, res) {
  const { user } = res.locals;
  const { postId } = req.params;
  console.log(postId);

  // 좋아요 수 : Like DB안에 postId가 갖고있는 데이터베이스 개수 세기
  const likeN = await Like.find({ postId }).exec();
  const likeNum = likeN.length; //

  // 내가 좋아요 했는지 확인. 좋아요 눌렀으면 1==true|| 안눌렀으면 0==false
  const likes = await Like.find({ postId: postId, userId: user.userId });
  const userLike = likes.length;

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
        likeNum: likeNum,
        userLike: !!userLike,
      },
    });
  } catch (err) {
    res.status(400).json({ err, result: false });
  }
}

module.exports.allPost = allPost;
module.exports.allPost2 = allPost2;
module.exports.writePost = writePost;
module.exports.getPostDetail = getPostDetail;
module.exports.updatePost = updatePost;
module.exports.deletePost = deletePost;
