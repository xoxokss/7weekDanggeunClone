
const express = require("express");
const PostController = require("../controller/postController");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();


router.post("/", authMiddleware, PostController.writePost);


router.get("/", PostController.allPost);


router.get("/:postId", PostController.getPostDetail);


router.put("/:postId", authMiddleware, PostController.updatePost);


router.delete("/:postId", authMiddleware, PostController.deletePost);



module.exports = router;
