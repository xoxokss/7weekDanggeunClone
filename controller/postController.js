const Post = require("../models/post");
const Like = require("../models/like");

// 게시글 전체 조회 API
// 요구사항 : 지역으로 filter, 시간순으로 sort, likeNum
// 나중에는 지역을 쿼리 값으로 받아 필터링할 수 있을 것 같다.
async function allPost(req, res) {
  try {
    const { user } = res.locals;
    // const { page, location } = req.query; //2차 스코프, 쿼리로 

    const existedPost = await Post.find(user.userLocation);
    console.log(existedPost);

    // const likeNum = Like.keys({ postId });

    const posts = {
      postId: existedPost.postId,
      userLocation: existedPost.userLocation,
      title: existedPost.title,
      price: existedPost.price,
      postImg: existedPost.postImg,
      // likeNum,
      createdAt,
    };
    console.log(posts);

    res.status(200)
    .json(
      userLocation, 
      posts
      .sort({ CreateAt: "desc" })
      // .skip(page) // 무한스크롤 관련
      // .limit(4)
      );
  } catch(err) {
    console.log(err)
    res.status(400).json({ result: false });
  }
}

// 게시글 작성 API
async function writePost(req, res) {
  try {
    // const { user } = res.locals; // JWT 인증 정보
    const { title, postImg, category, content, price } = req.body;
    await Post.create({
      //userId,//: user.userId,
      nickname,//: user.nickname,
      userLocation,//: user.userLocation,
      title,
      category,
      postImg,
      content,
      price,
      tradeState : "0"
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
    const { postId } = res.params;
    const { title, postImg, category, content, price } = req.body;

    const existedPost = await Post.findById({ _id: postId }); // DB에서 postId가 같은 데이터 찾기
    if (!user.userId === existedPost.userId) {
      // 로그인 정보와 게시글 작성자가 같은지 확인
      res.json({
        result: false,
        message: "사용자가 작성한 게시글이 아닙니다.",
      });
    } else {
      await Post.findByIdAndUpdate(
        { _id: postId }, //해당 postId 찾아서 내용 수정
        {
          userId: user.userId,
          nickname: user.nickname,
          userLocation: user.userLocation,
          title,
          category,
          postImg,
          content,
          price,
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
    const { postId } = res.params;

    const existedPost = await Post.findById({ _id: postId }); // DB에서 postId가 같은 데이터 찾기
    if (!user.userId === existedPost.userId) {
      // 로그인 정보와 게시글 작성자가 같은지 확인
      res.json({
        result: false,
        message: "사용자가 작성한 게시글이 아닙니다.",
      });
    } else {
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
  const { postId } = res.params;
  const { user } = res.locals; // JWT 인증 정보

  const likeNum = Like.keys({ postId }); // Like DB안에 해당 postId 데이터베이스 갯수
  const userLike = await Like.findById({ id_: user.userId });

  try {
    const existedPost = await Post.find({ postId }).sort("createdAt");
    const detailPost = {
      postId,
      title: existedPost.title,
      content: existedPost.content,
      postImg: existedPost.postImg,
      nickname: existedPost.nickname,
      userLocation: existedPost.userLocation,
      mannerOndo: existedPost.mannerOndo,
      price: existedPost.price,
      likeNum,
      userLike,
    };

    res.status(200).json(detailPost);
  } catch {
    res.status(400).json({ result: true });
  }
}

module.exports.allPost = allPost;
module.exports.writePost = writePost;
module.exports.getPostDetail = getPostDetail;
module.exports.updatePost = updatePost;
module.exports.deletePost = deletePost;
