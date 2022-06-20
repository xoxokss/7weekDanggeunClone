const jwt = require("jsonwebtoken");
const user = require("../models/user");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("gudetama");
//const toHashPass = cryptr.encrypt('bacon');
//const toStingPass = cryptr.decrypt(encryptedString);
// console.log(encryptedString); // 2a3260f5ac4754b8ee3021ad413ddbc11f04138d01fe0c5889a0dd7b4a97e342a4f43bb43f3c83033626a76f7ace2479705ec7579e4c151f2e2196455be09b29bfc9055f82cdc92a1fe735825af1f75cfb9c94ad765c06a8abe9668fca5c42d45a7ec233f0
// console.log(decryptedString); // bacon

async function signup(req, res) {
  const { password, passwordcheck, phoneNum, nickname, userLocation, userImg } =
    req.body;

  const existphonNum = await user.findOne(phoneNum);
  const existnickname = await user.findOne(nickname);
  console.log(existphonNum, existnickname);
  if (password !== passwordcheck) {
    res
      .status(400)
      .send({ result: false,errorMessage: "check your passwordcheck is same as password" });

    return;
  }
  if (existphonNum) {
    res
      .status(400)
      .send({ result: false, errorMessage: "your phoneNumber is in using" });
    return;
  }
  if (existnickname) {
    res
      .status(400)
      .send({ result: false, errorMessage: "try use another nickname" });
    return;
  }

  const heshPassword = cryptr.encrypt(password);
  // console.log(password, phoneNum);
  const newUser = await user.create({
    password: heshPassword,
    phoneNum,
    nickname: nickname,
    userLocation,
    userImg,
  });

  res
    .status(200)
    .send({
      result: true,
      message: "now you can login with your phonenumber and passward! good job",
      newUser,
    });
}

async function login(req, res) {
  const { phoneNum, password } = req.body;
  const {
    nickname: usernick,
    password: userpass,
    userId: userId,
  } = await user.findOne({
    phoneNum,
  });

  const strpass = cryptr.decrypt(userpass);
  console.log(strpass);
  if (!usernick) {
    res
      .status(400)
      .send({ result: false, errorMessage: "회원정보가 없습니다!" });
  }

  if (password !== strpass) {
    res
      .status(400)
      .send({
        result: false,
        errorMessage: "이메일이나 비밀번호가 올바르지 않습니다.",
      });
    return;
  }

  const token = jwt.sign({ userId: userId }, "gudetama");

  res.status(200).send({ result: true, message: "wellcome", token });
}

// //사용자 인증
async function checkMe(req, res) {
  const { userLocation, userId,nickname,userImg } = res.locals.user;
  res.send({
    userLocation , userId, nickname, userImg
 });
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.checkMe = checkMe;
