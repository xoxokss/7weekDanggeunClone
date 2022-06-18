const Post = require("../models/post");
const Like = require("../models/like");

// 게시글 전체 조회 API
// 요구사항 : 지역으로 filter, 시간순으로 sort, likeNum
// 나중에는 지역을 쿼리 값으로 받아 필터링할 수 있을 것 같다.
// 로그인하지 않은 유저의 userLocation은 어쩌지? if문으로? auth 미들웨어가 가만히 있을까?
async function allPost(req, res) {
  try {
    // const { user } = res.locals; // 로그인을 해야만 유저의 지역을 활용할 수 있다. 2차스코프
    // const { page } = req.query; //무한스크롤용
    // const {sort} = req.query; //2차 스코프, 쿼리로

    // const existedPost = await Post.find(user.userLocation); //유저 지역 게시글 찾기

    let posts = [];
    posts = await Post.find().sort({ createdAt: "asc" }).exec(); //일단 작성시간 순 내림차순
    console.log(posts); //[]배열 안에 게시글 하나씩[{게시글1},{게시글2},{게시글3}]
    const likeNum = await Like.keys({ postId }).length;
    const likeNum2 = await Like.find({ postId }).length;
    //맵 함수로 집어넣어야할듯

    console.log(likeNum, likeNum2);
    res.send({
      posts: posts.map((a) => ({
        postId: a.postId,
        userLocation: user.userLocation,
        title: a.title,
        price: a.price,
        postImg: a.postImg,
        likeNum: likeNum,
        createdAt:
          a.createdAt.toLocaleDateString("ko-KR") +
          a.createdAt.toLocaleTimeString("ko-KR"),
      })),
    });

    res.status(200).json({
      userLocation: "성수동2가", //로그인 유저 지역 활성화시 수정하기
      posts,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ result: false });
  }
}

// 게시글 작성 API
async function writePost(req, res) {
  try {
    const { user } = res.locals; // JWT 인증 정보
    const { title, postImg, category, content, price } = req.body;
    await Post.create({
      userId: user.userId,
      nickname: user.nickname,
      userLocation: user.userLocation,
      title,
      category,
      postImg,
      content,
      price,
      tradeState: "0",
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
    const { postId } = res.params;

    const existedPost = await Post.findById({ _id: postId }); // DB에서 postId가 같은 데이터 찾기
    if (user.userId !== existedPost.userId) {
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

  const likeNum = Like.keys({ postId }).length; // Like DB안에 해당 postId 데이터베이스 갯수
  const userLike = await Like.findById({ id_: user.userId });

  try {
    const existedPost = await Post.findone({ postId });
    const detailPost = {
      postId,
      title: existedPost.title,
      content: existedPost.content,
      postImg: existedPost.postImg,
      nickname: existedPost.nickname,
      userLocation: existedPost.userLocation,
      mannerOndo: existedPost.mannerOndo,
      price : existedPost.price,
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
