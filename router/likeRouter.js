const express = require("express");
const LikeController = require("../controller/likeController");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

router.post("/:postId", authMiddleware, LikeController.onlike);

router.delete("/:postId", authMiddleware, LikeController.unlike);

module.exports = router;
