const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // cors 패키지 연결
const UserRouter = require("./router/userRouter");
const PostRouter = require("./router/postRouter");
const LikeRouter = require("./router/likeRouter");
const connectDB = require("./database/database");
const moment = require("moment");
const reqlogMiddleware = require("./middlewares/request-log-middleware");
require("dotenv").config(); // env 패키지 연결

const app = express();

//express socket.io 통합 서버 연결 (8080번)
const http = require("http").createServer(app);
const io = require("socket.io")(http);

/*
// socket.io 별도 서버 연결 (4000번)
const http2 = require("http").createServer();
const io = require("socket.io")(http);

http2.listen(4000, () => { console.log('소켓 서버 4000번')});
*/

let room = ["room1", "room2"]; // room 2개
let a = 0; // room 번호 변수

// 소켓 연결
io.on("connection", (socket) => {
  console.log("유저가 접속했습니다.");

  /*
  // room 으로 방이 나뉠 때
  socket.on("joinRoom", (num, name) => {
    console.log(name + "님이" + room[num] + "번 방에 입장했습니다.");
    io.to(room[num]).emit(name, num, "joinRoom");
  });
  socket.on("leaveRoom", (num, name) => {
    console.log(name + "님이" + room[num] + "번 방을 퇴장했습니다.");
    io.to(room[num]).emit(name, num, "leaveRoom");
  });
  */

  // 이벤트 - 채팅 메세지 - 기본
  socket.on("chatting", (data) => {
    const { nickname, msg, userImg } = data;
    io.emit("chatting", {
      nickname,
      msg,
      userImg,
      time: moment(new Date()).format("h:ss A"),
    }); // 메시지 송신
  });

  /*
  // 이벤트 - 채팅 메세지 - room
  socket.on("chatting", (num, data) => {
    let {name, msg, userImg} = data
    a = num;
    io.to(room[a]).emit("chat message", name, msg, userImg); // 메시지 송신
  });
*/

  // 이벤트 - 소켓 연결 해제
  socket.on("disconnect", () => {
    console.log("유저가 접속을 해제했습니다.");
  });
});

const corsOption = {
  origin: [
    "http://localhost:3000",
    "http://spartastatic.s3-website.ap-northeast-2.amazonaws.com",
    "http://localhost:8080",
    "*",
  ],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  // credentials: true,
};
//cors 설정

connectDB();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//미들웨어 실행
app.use(reqlogMiddleware);
app.use(cors(corsOption));

// 최상위 URL 접속 메세지
app.get("/", (req, res) => {
  res.status(200).send("Backend Sever");
});

// 라우터 등록
app.use("/api/user", UserRouter);

app.use("/api/post", PostRouter);

app.use("/api/like", LikeRouter);

http.listen(process.env.PORT, () => {
  console.log(process.env.PORT, "번 포트를 통해 연결됐어요.");
});
