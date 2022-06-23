const http = require("./app") // app.js에서 http 객체 가져오기
require("./socket") //socket.js 코드 실행
// require("dotenv").config(); // env 패키지 연결

/*
app.js의 역할은 서버가 아니라 API 구현의 역할이다. 그래서 분리한 것.
앞으로는 server.js를 실행해서 서버를 켜야한다.
*/

http.listen(process.env.PORT, () => {
  console.log(process.env.PORT, "번 포트를 통해 연결됐어요.");
});