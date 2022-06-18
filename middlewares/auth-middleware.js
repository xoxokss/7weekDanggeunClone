const User = require("../models/user");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = (authorization || "").split(" ");

  if (!tokenValue || tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "you need to login",
    });
    return;
  }
  try {
    const { userId } = jwt.verify(tokenValue, "gudetama");

    const user = await User.findById(userId);

    res.locals.user = user;
    next();
  } catch (error) {
    // 토큰이 없거나, 유효하지 않은 토큰인 경우 이쪽으로 접근.
    res.status(401).send({ errorMessage: "로그인이 필요한 페이지 입니다." });
    return;
  }
};
