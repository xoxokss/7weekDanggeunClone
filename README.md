
# 🥕 당근마켓 클론 코딩 🥕

## 👋프로젝트 소개
항해 99 7기 D반 3조 당근마켓 클론코딩 백엔드 Github 입니다.<br/>
React & Node.js 로 이루어진 팀입니다 <br/>
<br/>
## 팀원 소개와 역할
#### Frontend (https://github.com/epppo/carrot_front)
__김지혜__ : 판매글 작성페이지 / 상세 페이지 (관심 상품 기능) <br/>
__박수봉__ : 로그인 / 회원가입 페이지 / 유저 프로필 페이지(거래 상태 기능)<br/>
__이보람__ : 전체 게시글 페이지 / 게시글 수정 & 삭제 토글 / 판매내역 & 구매목록 & 관심목록 페이지 / socket.io 실시간 채팅 페이지<br/>

 #### Backend (https://github.com/xoxokss/7weekDanggeunClone)
__김상선__ : 판매 게시글 CRUD API 구현 / socket.io 서버 구현 / AWS EC2 서버 배포 <br/>
__이재근__ : 회원가입 / 로그인 / 프로필 수정 / 관심 상품 기능 API 구현 <br/>
<br/>
<br/>
## 👨‍💻 프로젝트 기간

2022년 6월 17일 ~ 2022년 6월 23일 (총 7일)

<br/>
<br/>

## 📚 기술스택 소개
<p align="center">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&  logoColor=white">
<img src="https://img.shields.io/badge/JSON Web Tokens-000000?style=for-the-badge&logo=JSON Web Tokens&logoColor=FFFFFF"/>
<br/>
<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=FFFFFF"/> 
<img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=for-the-badge&logo=GitHub Actions&logoColor=FFFFFF"/> 
<img src="https://img.shields.io/badge/OBS Studio-302E31?style=for-the-badge&logo=OBS Studio&logoColor=000000"/> 
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=FFFFFF"/>
  
## 🎬 시연영상
[시연영상 Youtube](https://youtu.be/gpb6dWag9Uo)<br/>
<br/>
<br/>
 
## 🐶🍯 사이트 주소
 <p>

 프론트 엔드 도메인 : http://spartastatic.s3-website.ap-northeast-2.amazonaws.com</br>
 백엔드 서버 : http://54.180.121.151
  

<br/>
<br/>

## 🎨 프로젝트 초안(와이어 프레임)

<img width="800" alt="스크린샷 2022-06-23 오후 3 40 03" src="https://user-images.githubusercontent.com/99164731/175232106-eaae4b3d-4c11-4e36-a408-aff256a7c417.png">


## 🔨 개발툴
 #### Backend
-   Server: AWS EC2 (Ubuntu 18.04 LTS)
-   Database : MongoDB
-   Runtime Flatform : Node.js
-   Socket.io
-   Tool : Git, Notion

<br/>
<br/>
  
  ## 🛠 구현한 기능 
<li> <b> 로그인 / 회원가입 페이지 </b><br/>
: 회원가입 정보는 암호화로 DB에 저장되며 JWT를 이용해 로그인합니다.<br/>

<br/>

<li> <b> 메인 페이지 </b><br/>
: 사용자의 거주 지역에 해당하는 판매 글을 볼 수 있습니다. <br/>
: 판매 게시글은 기본적으로 이미지 썸네일과 제목, 가격이 표기되며, 해당 상품을 관심상품으로 등록한 모든 사용자들의 하트의 개수가 함께 디스플레이 됩니다. <br/><br/>
  
<li> <b>  게시글 상세 조회 페이지</b><br/>
: 판매 글의 상세 페이지를 볼 수 있습니다. 하트를 눌러 관심목록에 저장할 수 있습니다. <br/>
: 상품 이미지과 제목, 내용, 가격이 표기되며, 해당 상품을 관심상품으로 등록한 모든 사용자들의 하트의 개수가 함께 디스플레이 됩니다. <br/>
: 거래하기 버튼을 누르면 판매자와 채팅 화면으로 이동합니다. <br/><br/>
 
 <li> <b> 거래 채팅 페이지</b><br/>
: 해당 상품을 거래하는 상대방과 socket.io를 통해 실시간으로 채팅을 할 수 있습니다. <br/><br/>
   
 <li> <b> 게시글 수정 삭제 페이지</b><br/>
: 사용자의 거주 지역과 닉네임, 프로필 이미지를 수정할 수 있습니다. <br/><br/>

 <li> <b> 나의 당근 페이지</b><br/>
: 사용자의 판매 목록, 관심 목록을 볼 수 있습니다. <br/>
: 판매 중인 상품은 예약중/거래완료 중 상태를 선택할 수 있습니다. <br/><br/>
  
 <li> <b> 프로필 수정 페이지</b><br/>
: 사용자의 닉네임, 프로필 사진, 거주지역을 변경할 수 있습니다. <br/><br/>
  

 

 ## API 설계
[API Notion 링크](https://www.notion.so/4b3fc723bb9846508382a3e8b4da9a83?v=7e9e2f63863a43b9b697390fc4dbd5ba)
<br/>
<br/>
 
## ERD
 <img width="800" src = https://velog.velcdn.com/images/montoseon/post/20050485-2c6d-44e5-8af1-a3c3ae11e90b/image.png>
<br/>
<br/>

## 💣 프로젝트 중 힘들었던 점이 있다면?
1) API 명세서 작성 : <br/>
2) crypt
  
## 시간적 여유가 더 있었다면 추가하고 싶은 것은?


 
## 기술 매니저님 피드백
