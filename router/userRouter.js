const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const userController = require("../controller/userController");

const router = express.Router();

// 회원가입 API
router.post("/signup", userController.signup);

// 로그인 API
router.post("/login", userController.login);

// 내 정보 조회 API
router.get("/me", authMiddleware, userController.checkMe);

// 나의 판매내역
router.get("/sellList", authMiddleware, userController.mySellList);

// 프로필 수정
router.put("/edit", authMiddleware, userController.userEdit);


module.exports = router;
