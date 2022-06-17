const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("gudetama");
//const toHashPass = cryptr.encrypt('bacon');
//const toStingPass = cryptr.decrypt(encryptedString);
//회원가입
async function signUp(req, res) {
res.status(200);
}
//로그인
async function login(req, res) {
res.status(200);
}
// //사용자 인증
async function checkMe(req, res) {
res.status(200);
}
module.exports.signUp = signUp;
module.exports.login = login;
module.exports.checkMe = checkMe;