const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // cors 패키지 연결
const UserRouter = require("./router/userRouter");
const PostRouter = require("./router/postRouter");
const LikeRouter = require("./router/likeRouter");
const connectDB = require("./database/database");
const reqlogMiddleware = require("./middlewares/request-log-middleware");
require("dotenv").config(); // env 패키지 연결

const port = 8080;

const corsOption = {
  origin: ["*"],
  credentials: true,
};
//cors 설정

connectDB();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//미들웨어 실행
app.use(reqlogMiddleware);
app.use(cors(corsOption));

//라우터 등록
app.get("/", (req, res) => {
  res.send("Backend Sever");
});
//app.use("/api", [PostRouter, LikeRouter, UserRouter]);
//app.use의 사용방법 알아보세용
app.use("/api/user", UserRouter);

app.use("/api/post", PostRouter);

app.use("/api/like", LikeRouter);

app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌어요~!");
});
