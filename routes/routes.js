var express = require('express');
var extend = require('node.extend');

var Life = require('../config/life');
var Req = require('../config/request');

var router = express.Router();
var app = express();

var User = Req.User;
var Activity = Req.Activity;


//接口文档
router.get('/model-api', function(req, res, next) {
    var data = Req.config;
    res.render('model', data);
});


//所有路径的公共部分
router.use(function (req, res, next) {
    console.log('---------------------' + new Date().toTimeString());

    //公共数据结构
    res.locals.resData = {
        cookies : req.headers.cookie || '',
        login : {
            isLogin : false,
            icon : null,
            userId : null,
            userName : null
        },
        title : '生活嘉兴',
        uploadUrl : Life.JavaHost + '/life/common/upload.json?path='+ Life.Host +'/upload.html',
        data : {},
        onGetData : function(){}
    };

    //判断是否登陆
    User.GetLoginStatus().withCookie(res.locals.resData.cookies).done(function(loginRes){
        Life.Log(loginRes);
        if(loginRes.success == true){
            res.locals.resData.login = {
                isLogin : true,
                icon : loginRes.data.icon,
                userId : loginRes.data.userId,
                userName : loginRes.data.userName
            };
        }
        next();
    });
});


//首页
router.get('/', function(req, res, next) {
    res.locals.resData.data = {
        type : 'dateCreated',
        list : null,
        hotTag : null,
        tag : null,
        reqData : {
            "pageNumber": 1,
            "pageSize": 15,         //修改该值时，请同时修改ejs中该值，否则会出现bug
            "property": null,
            "keyword": null,
            "orderBy": 'dateCreated',
            "condition": {
            }
        }
    };

    Req.Activity.GetHotActivities('6')
        .withCookie(res.locals.resData.cookies)
        .done(function(_res){
            Life.Log(_res);
            res.locals.resData.data.list = _res.data;
            res.render('index', res.locals.resData);
        });
});


//子页面路由
var index = require('./index');
var users = require('./users');
var activity = require('./activity');
var about = require('./about');

router.use('/index', index);
router.use('/users', users);
router.use('/activity', activity);
router.use('/about', about);

router.get('*', function(req, res){
    res.render('error.ejs', {
        title: 'No Found'
    })
});


module.exports = router;
