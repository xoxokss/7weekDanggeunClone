const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserRouter = require("./router/userRouter");
const PostRouter = require("./router/postRouter");
const likeRouter = require("./router/likeRouter");
const connectDb = require("./database/database"); //몽고디비 스키마 연결
const reqlogMiddleware = require("./middlewares/request-log-middleware");

const port = 8080;

connectDb(); //몽고디비 실행

const corsOption = {
    origin: "*",
    credentials: true,
};
//cors 설정

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));

const app = express();

//body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//미들웨어 실행
app.use(reqlogMiddleware);
app.use(cors(corsOption));

//라우터 등록
app.get("/", (req, res) => {
    res.send("Backend Sever")
});
app.use("/user", UserRouter);

app.use("/post", PostRouter);

app.use("/like", likeRouter);

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요~!")
});
