const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Post = require("../models/post");
const Like = require("../models/like");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("gudetama");
const Joi = require("joi");

const UserSchema = Joi.object({
  phoneNum: Joi.string().pattern(new RegExp("^[0-9]{11,11}$")).required(),
  nickname: Joi.string().pattern(
    new RegExp("^[ㄱ-ㅎ가-힣0-9a-zA-Z@$!%#?&]{3,10}$")
  ),
  password: Joi.string().required().min(4),
  passwordCheck: Joi.string().min(4),
  userLocation: Joi.string(),
});

// 회원가입 API
async function signup(req, res) {
  try {
    const { phoneNum, password, passwordCheck, nickname, userLocation } =
      await UserSchema.validateAsync(req.body);
    const existUsers = await User.find({ $or: [{ phoneNum }, { nickname }] });
    console.log(existUsers);

    if (password !== passwordCheck) {
      res.status(400).send({
        result: false,
        message: "패스워드가 패스워드 확인란과 일치하지 않습니다.",
      });
      return;
    }
    if (existUsers.length) {
      res.status(400).send({
        result: false,
        message: "이미 가입된 휴대폰번호 또는 닉네임이 있습니다.",
      });
      return;
    }
    const hashPassword = cryptr.encrypt(password); //비밀번호 암호화
    //DB에 사용자 정보 생성
    await User.create({
      phoneNum,
      password: hashPassword,
      nickname,
      userLocation,
      userImg: "https://3dyoon.imweb.me/common/img/default_profile.png",
      mannerOndo: "36.5",
    });
    res.status(201).send({ result: true, message: "회원가입 완료" });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      result: false,
      message: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

// 로그인 API
async function login(req, res) {
  try {
    const { phoneNum, password } = req.body;
    const { phoneNum: userPhone, password: userPW } = await User.findOne({
      phoneNum,
    });

    const strpass = cryptr.decrypt(userPW);
    if (!userPhone) {
      res.status(401).send({ result: false, message: "회원정보가 없습니다!" });
      return;
    }

    if (password !== strpass) {
      res.status(401).send({
        result: false,
        message: "이메일이나 비밀번호가 올바르지 않습니다.",
      });
      return;
    }

    const token = jwt.sign({ phoneNum: phoneNum }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // 웰컴 메세지
    const userNick = await User.findOne({phoneNum:phoneNum})
    console.log(userNick.nickname+"님이 로그인했습니다.")

    //토큰 인증시간을 하루로 제한 ,{expiresIn:'24h'}
    res.status(200).json({ token, result: true, message : userNick.nickname+"님이 로그인했습니다."});
  } catch (err) {
    console.log(err);
    res.status(400).send({ result: false });
  }
}

// 사용자 인증
async function checkMe(req, res) {
  const { user } = res.locals;
  res.send({
    user: {
      userId: user.userId,
      nickname: user.nickname,
      userLocation: user.userLocation,
      userImg: user.userImg,
    },
  });
}

// 나의 판매내역 API
async function mySellList(req, res) {
  const { user } = res.locals;
  try {
    const sellList = await Post.find({ userId: user.userId }).sort({
      createdAt: "asc",
    });
   
    res.status(200).json({ result:true, 
      sellList: sellList.map((a) => ({
      postId: a.postId,
      title: a.title,
      price: a.price,
      postImg: a.postImg,
      userLocation: a.userLocation,
      tradeState: a.tradeState,})
      )
    })
  } catch (err) {
    console.log(err);
    res.status(400).send({ result: false });
  }
}

// 나의 관심목록
async function myLikeList(req, res) {
  const { user } = res.locals;

  try {
    //해당 유저가 누른 좋아요 like DB 전체 찾기
    const like = await Like.find({ userId: user.userId }).exec();
    const likeList = [];
    
    // 반복문으로 좋아요 테이블 하나씩 postId를 찾는다.
    for (i = 0; i < like.length; i++) {
      list = await Post.findById(like[i].postId).exec(); 
      likeList.push(list); //postId에 해당하는 테이블을 하나씩 배열에 넣는다
    }

    //map함수로 프론트엔드가 원하는 양식으로 response 보내기. postId를 포함해야한다.
    res.status(200).json({
      likeList: likeList.map((a) => ({
        postId: a.postId,
        title: a.title,
        price: a.price,
        postImg: a.postImg,
        userLocation: a.userLocation,
        tradeState: a.tradeState,
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ result: false });
  }
}

// 프로필 수정
async function userEdit(req, res) {
  const { user } = res.locals;
  const { userImg, nickname, userLocation } = req.body;

  try {
    await User.findByIdAndUpdate(
      { _id: user.userId },
      {
        $set: {
          userImg: userImg,
          nickname: nickname,
          userLocation: userLocation,
        },
      }
    );
    res.status(200).send({ result: true });
  } catch (err) {
    console.log(err);
    res.status(400).send({ result: false });
  }
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.checkMe = checkMe;
module.exports.mySellList = mySellList;
module.exports.myLikeList = myLikeList;
module.exports.userEdit = userEdit;
