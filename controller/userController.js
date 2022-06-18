const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
const user = require("../models/user");
const cryptr = new Cryptr("gudetama");

async function signup(req, res) {

    const { password, passwordcheck, phoneNum, nickname, userLocation, userImg } =
      req.body;

    const newUser = await user.create({
      phoneNum,
      password,
      nickname,
      userLocation,
      userImg,
    });
      
    res.status(201).send({ message: "now you can login with your phonenumber and passward! good job" }, newUser
  )
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

module.exports.signup = signup;
module.exports.login = login;
module.exports.checkMe = checkMe;

