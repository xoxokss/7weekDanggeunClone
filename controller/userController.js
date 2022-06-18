const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
const user = require("../models/user");
const cryptr = new Cryptr("gudetama");
const Joi = require("joi");

const UserSchema = Joi.object({
  phoneNum: Joi.string().pattern(new RegExp("^[0-9]{11,11}$")).required(),

  nickname: Joi.string().pattern(
    new RegExp("^[ㄱ-ㅎ가-힣0-9a-zA-Z@$!%#?&]{3,10}$")
  ),

  password: Joi.string().required().min(4),

  passwordCheck: Joi.string().min(4),
});

// 회원가입 API
async function signup(req, res) {
  try {
    const { phoneNum, password, passwordCheck } =
      await UserSchema.validateAsync(req.body);
    const existUsers = await User.find({ phoneNum });

    if (password !== passwordCheck) {
      res.status(400).send({
        alert: "패스워드가 패스워드 확인란과 일치하지 않습니다.",
      });
      return;
    }
    if (existUsers.length) {
      // phoneNum 중복체크
      res.status(400).send({
        alert: "이미 가입된 휴대폰번호 또는 닉네임이 있습니다.",
      });
      return;
    }
    const hashPassword = cryptr.encrypt(password);

    await User.create({
      phoneNum,
      password: hashPassword,
      nickname: "닉네임을 변경해주세요.",
      userLocation: "",
      userImg: "",
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

    // const { phoneNum, password } = req.body;

    // const { password: userPW } = await User.findOne({ phoneNum: phoneNum });
    // const hashPassword = cryptr.decrypt(userPW);
    // console.log(hashPassword);

    // const user = await User.findOne({
    //   phoneNum: phoneNum,
    //   password: hashPassword,
    // }).exec();
    // console.log(user.password);
    // if (!user) {
    //   res.status(401).send({
    //     //401 인증실패 상태코드
    //     alert: "비밀번호 또는 휴대폰 번호를 확인해보세요",
    //   });
    //   return;
    // }

    const token = jwt.sign({ phoneNum: phoneNum }, process.env.JWT_SECRET);
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
  const { user } = res.locals;
  res.send({
    user: {
      user_id: user.user_id,
      nickname: user.nickname,
      userLocation: user.userLocation,
    },
  });
}

module.exports.signUp = signup;
module.exports.login = login;
module.exports.checkMe = checkMe;
