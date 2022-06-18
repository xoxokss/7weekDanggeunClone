const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
const user = require("../models/user");
const cryptr = new Cryptr("gudetama");

async function singup(req, res) {
  try {
    const {
      Password,
      passwordcheck,
      phoneNum,
      nickname,
      userLocation,
      userImg,
    } = req.body;

    const existphonNum = await user.findOne().select(phoneNum);
    const existnickname = await user.findOne().select(nickname);

    if (Password !== passwordcheck) {
      res
        .status(400)
        .send({ errorMessage: "check your passwordcheck is same as password" });
    }
    if (existphonNum) {
      res.status(400).send({ errorMessage: "your phoneNumber is in using" });
    }
    if (existnickname) {
      res.status(400).send({ errorMessage: "try use another nickname" });
    }

    const password = cryptr.encrypt(Password);
    console.log(password, phoneNum);
    const newUser = await user.create({
      password,
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
      ,newUser
    );
  } catch (err) {
    res.status(400).send({
      errorMessage: "follow our user form",
    });
  }
}

async function login(req, res) {
    const { phoneNum, password } = req.body

    const token = jwt.sign({ userId: user.userId }, "gudetama");
    res.status(200).send({message:"wellcome"},token)

}


async function checkMe(req, res) {
 
    const { userLocation } = res.locals.user;
    res.send({
      userLocation,
    });
};

module.exports.singup = singup;
module.exports.login = login;
module.exports.checkMe = checkMe;

