const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)


app.use(bodyParser.json()); //body-parser 사용. 
                            //-> 아개 있어야 성공적으로 요청값을 받을 수 있음. 반드시 라우터 설정 보다 위에 작성
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

//cors 사용
app.use(cors());

/* use router class */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mainpage = require('./routes/mainpage/index');
const sqlconnect=require('./routes/mainpage/mainpage.controller');

app.use('/mainpage', mainpage);
//const chatname = ChattingRoomModel.chatname


// 소켓 연결 코드
io.sockets.on('connection', (socket) => {

    console.log(`Socket connected : ${socket.id}`)

    socket.on('create', (data) => {
      const StudyRoomModel = JSON.parse(data);
      const roomTitle= StudyRoomModel.roomTitle;
  
      socket.join(`${roomTitle}`)
      console.log(`create `+roomTitle)


      //방 생성
      sqlconnect.createRoom(roomTitle)

    })

    //방 삭제
    socket.on('delete', (data) => {
      const session = require('express-session');
      // const rid= session.rId;
      const rId=sqlconnect.roomid
      console.log(`delete `+ rId)

      
      sqlconnect.deleteRoom(rId)
    
    })



    //입장시
    socket.on('enter', (data) => {
      const ChattingRoomModel = JSON.parse(data)
      const chatname = ChattingRoomModel.chatname
      const roomnumber = ChattingRoomModel.roomnumber
    
   
  
      //소켓 연결될 때 방 번호 받아옴
      //이름, 방 번호 로그로 출력
      socket.join(`${roomnumber}`)
      console.log(`[chatname : ${chatname}] entered [room number : ${roomnumber}]`)
      
      //입장했다고 알림
      const enterData = {
        type : "ENTER",
        content : `${chatname} 님이 입장했습니다`  
      }
      socket.broadcast.to(`${roomnumber}`).emit('update', JSON.stringify(enterData))
    })
  
    //퇴장시
    socket.on('left', (data) => {
      const ChattingRoomModel = JSON.parse(data)
      const chatname = ChattingRoomModel.chatname
      const roomnumber = ChattingRoomModel.roomnum
  
      socket.leave(`${roomnumber}`)
      console.log(`[chatname : ${chatname}] left [room number : ${roomnumber}]`)
  
      const leftData = {
        type : "LEFT",
        content : `${chatname} 님이 퇴장했습니다`  
      }
      socket.broadcast.to(`${roomnumber}`).emit('update', JSON.stringify(leftData))
    })
  
    //메시지가 입력되면 내용 소켓으로 받아와서 전송
    socket.on('newMessage', (data) => {
      const messageData = JSON.parse(data)
      console.log(`[Room Number ${messageData.to}] ${messageData.from} : ${messageData.content}`)
      socket.broadcast.to(`${messageData.to}`).emit('update', JSON.stringify(messageData))
    })
  
  
    socket.on('disconnect', () => {
      console.log('Socket disconnected : ${socket.id}')
    })
  })


server.listen(port, () => console.log(`Listening on port ${port}`)); // 서버 가동
module.exports = app;
