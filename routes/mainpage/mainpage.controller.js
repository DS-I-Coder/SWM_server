const fs = require('fs'); // 파일 열고 읽고 할 때 사용하는 모듈
const data = fs.readFileSync('./database.json'); // database.json파일을 읽어서 data에 저장
const conf = JSON.parse(data); // string객체를 json형태로 변환
const mysql = require('mysql'); // mysql 모듈
const app=require('../../app.js');

// DB 연결 생성
const connection = mysql.createConnection({

    host: conf.host,

    user: conf.user,

    password: conf.password,

    port: conf.port,

    database: conf.database
    
});
connection.connect(); // DB 연결

/* 검색 */
exports.search = (req,res) =>{
    console.log('search');

    const keyword = req.query.keyword; //검색어 받기
    // mainpage/search?keyword=(req.query.keyword)

    connection.query(
        'SELECT roomTitle, maxParticipant, curParticipant FROM room WHERE roomTitle LIKE \'%'+keyword+'%\';',
        (err, rows, fields) => {
            console.log(err);
            res.send(rows); //rows가 위의 쿼리문에 대한 결과.
        }
    )
}

/* 카테고리 조회 */
// 앱에서 제공하는 카테고리를 조회하는 것으로, 앱 실행시 가져와 앱 내부 db
exports.category = (req,res) =>{
    console.log('category');
    
    connection.query(
        'SELECT category FROM category;',
        (err, rows, fields) => {
            console.log(err);
            res.send(rows);
        }
    )
}


exports.category = (req,res) =>{
  console.log('category');
  
  connection.query(
      'SELECT category FROM category;',
      (err, rows, fields) => {
          console.log(err);
          res.send(rows);
      }
  )
}


//방 생성-db에 새로운 행 추가
var roomid;
exports.createRoom = function(roomTitle){
  connection.query('INSERT INTO room (roomTitle) VALUES (?);',[roomTitle],(err, results,fields) =>{
    if (err) throw err;

    console.log('room created')
    //auto increment한 rid 출력
    roomid=results.insertId;
    console.log(roomid)
  })
}

//방 삭제
//지금 코드는 바로 직전에 insert 된 행이 삭제됨
exports.deleteRoom=function(rId){
  connection.query('DELETE FROM room WHERE rid = (?);',roomid,(err, result) =>{
    if (err) throw err
    else console.log('room deleted')
  })
}


