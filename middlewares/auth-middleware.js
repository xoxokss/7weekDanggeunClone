const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // const [tokenType, tokenValue] = (authorization || "").split(" ");
  const [tokenType, tokenValue] = authorization.split(" ");
  if (tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
    return;
  }
  try {
    const { phoneNum } = jwt.verify(tokenValue, process.env.JWT_SECRET);
    console.log("JWT 인증 미들웨어를 거치고 갔습니다.");
    User.findOne({ phoneNum: phoneNum })
      .exec()
      .then((user) => {
        res.locals.user = user;
        next();
      });
  } catch (error) {
    // 토큰이 없거나, 유효하지 않은 토큰인 경우 이쪽으로 접근.
    console.log(error)
    res.status(401).send({ errorMessage: "로그인이 필요한 페이지 입니다." });
    return;
  }
};
