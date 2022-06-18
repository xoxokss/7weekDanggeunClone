const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Joi = require("joi");

const UserSchema = Joi.object({
  phoneNum: Joi.string().required().pattern(new RegExp("^[0-9]$")).max(11),

  nickname: Joi.string()
  .pattern(new RegExp("^[ㄱ-ㅎ가-힣0-9a-zA-Z@$!%#?&]{3,10}$")),

  password: Joi.string().required().min(4),

  passwordCheck: Joi.string().min(4),
});

// 회원가입 API
async function signUp(req, res) {
  try {
    const {
      password,
      passwordCheck,
      phoneNum,
      nickname,
      userLocation,
      userImg,
    } = await UserSchema.validateAsync(req.body);

    if (password.includes(nickname)) {
      res.status(400).send({
        alert: "닉네임이 패스워드에 포함되어 있습니다!",
      });
      return;
    }
    if (password !== passwordCheck) {
      res.status(400).send({
        alert: "패스워드가 패스워드 확인란과 일치하지 않습니다.",
      });
      return;
    }
    //userId와 nickname 중복체크
    const existUsers = await User.find({
      $or: [{ userId }, { nickname }],
    });
    if (existUsers.length) {
      res.status(400).send({
        alert: "이미 가입된 휴대폰번호 또는 닉네임이 있습니다.",
      });
      return;
    }
    await User.create({
      phoneNum,
      password,
      nickname,
      userLocation,
      userImg,
    });
    res.status(201).send({ result: true, message: "로그인 완료" });
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
    const user = await User.findOne({ phoneNum, password }).exec();

    if (!user) {
      res.status(401).send({
        //401 인증실패 상태코드
        alert: "비밀번호 또는 휴대폰 번호를 확인해보세요",
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);
    res.status(200).send({ token, message: "wellcome" });
    console.log("JWT token: ", token);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      alert: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

// //사용자 인증
async function checkMe(req, res) {
  const { user } = res.locals;
  res.send({
    user: {
      user_id: user.user_id,
      nickname: user.nickname,
      userLocation: user.userLocation,
    },
  });
}

module.exports.signUp = signUp;
module.exports.login = login;
module.exports.checkMe = checkMe;
