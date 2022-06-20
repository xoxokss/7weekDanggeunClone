const jwt = require("jsonwebtoken");
const User = require("../models/user");
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
        alert: "패스워드가 패스워드 확인란과 일치하지 않습니다.",
      });
      return;
    }
    if (existUsers.length) {
      res.status(400).send({
        alert: "이미 가입된 휴대폰번호 또는 닉네임이 있습니다.",
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
      userImg : "",
      mannerOndo: "36.5",
    });
    res.status(201).send({ result: true, message: "회원가입 완료" });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      alert: "요청한 데이터 형식이 올바르지 않습니다.",
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
      res.status(401).send({ alert: "회원정보가 없습니다!" });
      return;
    }

    if (password !== strpass) {
      res
        .status(401)
        .send({ alert: "이메일이나 비밀번호가 올바르지 않습니다." });
      return;
    }

    const token = jwt.sign({ phoneNum:phoneNum }, process.env.JWT_SECRET);
    res.status(200).json({ token, message: "로그인 성공" });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      alert: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

// //사용자 인증
async function checkMe(req, res) {
<<<<<<< HEAD
  const { userLocation, userId,nickname,userImg } = res.locals.user;
  res.send({
    userLocation , userId, nickname, userImg
 });
=======
  const { user } = res.locals;
  res.send({
    user: {
      user_id: user.user_id,
      nickname: user.nickname,
      userLocation: user.userLocation,
    },
  });
>>>>>>> 8e88ec9fbd5b2d1819d1545f3fc4786038299005
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.checkMe = checkMe;
