const express = require("express"); //express 불러오기
const {createServer} = require("http") //http 모듈 불러오기
const mongoose = require("mongoose"); // mongoose 불러오기
const cors = require("cors"); // cors 패키지 연결
const UserRouter = require("./router/userRouter"); //라우터 경로 연결
const PostRouter = require("./router/postRouter");
const LikeRouter = require("./router/likeRouter");
const connectDB = require("./database/database"); //mongoose model 연결
const reqlogMiddleware = require("./middlewares/request-log-middleware");

require("dotenv").config(); // env 패키지 연결

const app = express();
const http = createServer(app);

//CORS 설정
const corsOption = {
  origin: [
    "http://localhost:3000",
    "http://spartastatic.s3-website.ap-northeast-2.amazonaws.com",
    "http://localhost:8080",
  ],
  credentials: true,
};

connectDB();

// 몽구스 연결
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 미들웨어 실행
app.use(reqlogMiddleware);
app.use(cors(corsOption));

// 최상위 URL 접속 메세지
app.get("/", (req, res) => {
  res.status(200).send("Backend Sever");
});

// 라우터 실행
app.use("/api/user", UserRouter);

app.use("/api/post", PostRouter);

app.use("/api/like", LikeRouter);

// http.listen(process.env.PORT, () => {
//   console.log(process.env.PORT, "번 포트를 통해 연결됐어요.");
// });

module.exports = http; //모듈로 httpServer를 내보냄
