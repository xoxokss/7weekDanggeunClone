const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
const user = require("../models/user");
const cryptr = new Cryptr("gudetama");

async function singup(req, res) {
  try {
    const {
      password,
      passwordcheck,
      phoneNum,
      nickname,
      userLocation,
      userImg,
    } = req.body;

    const existphonNum = await user.findOne().select({ phoneNum });
    const existnickname = await user.findOne().select({ nickname });

    if (password !== passwordcheck) {
      res
        .status(400)
        .send({ errorMessage: "check your passwordcheck is same as password" });
    } else if (existphonNum) {
      res.status(400).send({ errorMessage: "your phoneNumber is in using" });
    } else if (existnickname) {
      res.status(400).send({ errorMessage: "try use another nickname" });
    }
    const hashPassword = cryptr.encrypt(password);
    const newUser = await user.create({
      $set: { password: hashPassword },
      phoneNum,
      nickname,
      userLocation,
      userImg,
    });

    res.status(200).send(
      {
        message:
          "now you can login with your phonenumber and passward! good job",
      }
      /*newUser*/
    );
  } catch (err) {
    res.status(400).send({
      errorMessage: "follow our user form",
    });
  }
}

async function login(req, res) {
  const { phoneNum, password } = req.body;
  const User = await user.findOne({ phoneNum });
  const nickname = User.nickname;
  const userpassword = User.password;
  const strpassword = cryptr.decrypt(userpassword);
  if (!User) {
    return res.status(400).send({ errorMessage: "회원정보가 없습니다!" });
  }
  const userCompared = await bcrypt.compare(password, strpassword);
  if (!userCompared) {
    return res
      .status(400)
      .send({ errorMessage: "이메일이나 비밀번호가 올바르지 않습니다." });
  }

  const token = jwt.sign({ userId: user.userId }, "gudetama");
  res.status(200).send({ message: "wellcome" }, token);
}

// //사용자 인증
async function checkMe(req, res) {
  const { userLocation } = res.locals.user;
  res.send({
    userLocation,
  });
}

module.exports.singup = singup;
module.exports.login = login;
module.exports.checkMe = checkMe;
