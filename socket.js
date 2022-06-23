const http = require("./app");
//app.js 가져오기 (app.js 파일의 맨밑에 module.exports로 내보냈음)
const socketIo = require("socket.io");

const app = express();

const io = socketIo(http, {
  cors: {
    // socket.io CORS 설정
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/*
//express socket.io 통합 서버 연결 (8080번)
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://spartastatic.s3-website.ap-northeast-2.amazonaws.com",
    // methods: ["GET", "POST"]
  },
});
*/

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

// moment 한국시간 설정
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");


app.get('/chatting/:postId', function(req, res){
    const roomId = req.params;

    res.render('roomId', {room : roomId});
});


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
