const router = require('express').Router() //라우터 객체 생성
const controller = require('./mainpage.controller')

/* 경로 설정 */
router.get('/search', controller.search); // mainpage/search
router.get('/category', controller.category); // mainpage/category


module.exports = router; // 모듈 내보냄. controller에서 exports로 쓸 수 있음