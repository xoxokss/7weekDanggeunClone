const express = require("express");
const PostController = require("../controller/postController");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();


router.get("/", PostController.allPost); //전체 게시글 조회 라우터




router.get("/:postId", authMiddleware, PostController.getPostDetail); // 게시글 상세 조회 라우터


router.post("/", authMiddleware, PostController.writePost); // 게시글 작성 라우터


router.put("/:postId", authMiddleware, PostController.updatePost); // 게시글 수정 라우터


router.delete("/:postId", authMiddleware, PostController.deletePost); // 게시글 삭제 라우터



module.exports = router;
