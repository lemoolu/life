var express = require('express');
var router = express.Router();
var app = express();


router.use(function (req, res, next) {
  console.log('---------------------' + new Date().toTimeString());
  next();
});


//接口文档
router.get('/model-api', function(req, res, next) {
  var data = require('../interface.json');
  res.render('model', data);
});


//首页
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



//登陆
router.get('/users/login', function(req, res, next){
});
//注册
router.get('/users/signup', function(req, res, next){
});
//个人详情
router.get('/users/info', function(req, res, next){
});
//个人详情 编辑页面
router.get('/users/info/edit', function(req, res, next){
});
//个人信息页面
router.get('/users/message', function(req, res, next){
});


//我的活动 草稿箱
router.get('/users/activities/draft', function(req, res, next){
});
//我的活动 审核中
router.get('/users/activities/auditing', function(req, res, next){
});
//我的活动 成功发起的
router.get('/users/activities/published', function(req, res, next){
});
//我的活动 审核不通过
router.get('/users/activities/publishfailed', function(req, res, next){
});
//我的活动 我参与的
router.get('/users/activities/joinin', function(req, res, next){
});
//我的活动 收藏夹
router.get('/users/activities/collection', function(req, res, next){
});


//活动列表展示（主页 ）
router.get('/activities/add', function(req, res, next){
});
//活动添加
router.get('/activities/add', function(req, res, next){
});
//活动详情
router.get('/activities/detail/:id?', function(req, res, next){
});


//关于我们
router.get('/about/aboutus', function(req, res, next){
});
//寻求合作
router.get('/about/cooperation', function(req, res, next){
});
//如何使用
router.get('/about/howtouse', function(req, res, next){
});


module.exports = router;
