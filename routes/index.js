var express = require('express');
var extend = require('node.extend');
var router = express.Router();
var app = express();

var UserData = require('./data-user.js');
var ActivityData = require('./data-activity.js');

var ModelProxy = require( '../lib/modelproxy/modelproxy');
ModelProxy.init( './interface.json' );
var User = new ModelProxy('User.*');
var Activity = new ModelProxy('Activity.*');


//接口文档
router.get('/model-api', function(req, res, next) {
    var data = require('../interface.json');
    res.render('model', data);
});



//所有路径的公共部分
router.use(function (req, res, next) {
    console.log('---------------------' + new Date().toTimeString());

    //公共数据结构
    res.locals.resData = {
        cookies : req.headers.cookie,
        login : {
            isLogin : false,
            icon : null,
            userName : null
        },
        title : '生活嘉兴',
        data : {},
        onGetData : function(){}
    };

    console.log(res.locals.resData.cookies);


    res.locals.resData.loginData = {
        isLogin : false,
        icon : null,
        userId : null,
        userName : null
    };

    //判断是否登陆
    User.GetLoginStatus().withCookie(res.locals.resData.cookies).done(function(loginRes){
        console.log(loginRes);
        if(loginRes.success == true){
            res.locals.resData.loginData = {
                isLogin : true,
                icon : loginRes.data.icon,
                userId : loginRes.data.userId,
                userName : loginRes.data.userName
            };
        }
        next();
    });



});


var cookie = '';

//首页
router.get('/', function(req, res, next) {

    res.locals.resData.data = {
        type : 'dateCreated',
        list : null,
        hotTag : null,
        tag : null,
        reqData : {
            "pageNumber": 1,
            "pageSize": 15,
            "property": null,
            "keyword": null,
            "orderBy": 'dateCreated',
            "condition": {
            }
        }
    };
    var resNum = 0;
    Activity.GetActivities(JSON.stringify(res.locals.resData.data.reqData)).withCookie(cookie).done(function(_res){
        res.locals.resData.data.list = _res.data.list;
        if( ++resNum == 3)
            res.render('index', res.locals.resData);
    });
    Activity.GetTags().withCookie(cookie).done(function(_tag){
        res.locals.resData.data.tag = _tag.data;
        if( ++resNum == 3)
            res.render('index', res.locals.resData);
    });
    Activity.GetHotTags().withCookie(cookie).done(function(_hotTag){
        res.locals.resData.data.hotTag = _hotTag.data;
        if( ++resNum == 3)
            res.render('index', res.locals.resData);
    });
});

router.use('/index', function(req, res, next){
    res.locals.resData.data = {
        type : 'dateCreated',
        list : null,
        hotTag : null,
        tag : null,
        reqData : {
            "pageNumber": 1,
            "pageSize": 15,
            "property": null,
            "keyword": null,
            "orderBy": 'dateCreated',
            "condition": {
            }
        }
    };

    res.locals.resData.onGetData = function(callback){
        var resNum = 0;
        Activity.GetActivities(JSON.stringify(res.locals.resData.data.reqData)).withCookie(cookie).done(function(_res){
            res.locals.resData.data.list = _res.data.list;
            if( ++resNum == 3)
                callback && callback();
        });
        Activity.GetTags().withCookie(cookie).done(function(_tag){
            res.locals.resData.data.tag = _tag.data;
            if( ++resNum == 3)
                callback && callback();
        });
        Activity.GetHotTags().withCookie(cookie).done(function(_hotTag){
            res.locals.resData.data.hotTag = _hotTag.data;
            if( ++resNum == 3)
                callback && callback();
        });
    };
    next();
});

//首页 按时间排序
router.get('/index/dateCreated', function(req, res, next) {

    extend(true, res.locals.resData.data, {
        type : 'dateCreated',
        reqData : {
            "orderBy": 'dateCreated'
        }
    });

    res.locals.resData.onGetData(function(){
        var data = res.locals.resData;
        res.render('index', data);
    });
});
//首页 按推荐排序
router.get('/index/recommended', function(req, res, next) {
    extend(true, res.locals.resData.data, {
        type : 'recommended',
        reqData : {
            "orderBy": 'recommended'
        }
    });
    res.locals.resData.onGetData(function(){
        var data = res.locals.resData;
        res.render('index', data);
    });
});
//首页 分类
router.get('/index/sort/:tagId/:tagName', function(req, res, next) {
    extend(true, res.locals.resData.data, {
        type : 'sortTag',
        tagName : req.params.tagName,
        reqData : {
            "orderBy": 'dateCreated',
            "condition": {
                tagId : req.params.tagId
            }
        }
    });
    res.locals.resData.onGetData(function(){
        var data = res.locals.resData;
        res.render('index', data);
    });
});
//首页 搜索
router.get('/index/search/:key', function(req, res, next) {
    extend(true, res.locals.resData.data, {
        type : 'search',
        keyWord : req.params.key,
        reqData : {
            "orderBy": 'dateCreated',
            "keyword": req.params.key
        }
    });
    res.locals.resData.onGetData(function(){
        var data = res.locals.resData;
        res.render('index', data);
    });
});

//登陆
router.get('/users/login', function(req, res, next){
    res.render('users-login', res.locals.resData);
});
//登陆
router.get('/users/login/success/:count/:password/:code?', function(req, res, next){
    console.info(req.params.count, req.params.password, req.params.code);
    User.Login(JSON.stringify({
        'loginName' : req.params.count,
        'password' : req.params.password,
        'checkCode' : req.params.code || ''
    })).withCookie('ewrwerw').done(function(res, cookie){
        console.log(res);
        console.log(cookie);

    });
    res.render('users-login', { title: 'Express' });
});
//注册
router.get('/users/signup', function(req, res, next){
    res.render('users-login', res.locals.resData);
});
//个人详情
router.get('/users/info', function(req, res, next){
    res.render('users-info', { title: 'Express' });
});
//个人详情 编辑页面
router.get('/users/info/edit', function(req, res, next){
    res.render('users-info-edit', { title: 'Express' });
});
//个人信息页面
router.get('/users/message', function(req, res, next){
    res.render('users-message', { title: 'Express' });
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
    res.render('about-aboutus', { title: 'Express' });
});
//寻求合作
router.get('/about/cooperation', function(req, res, next){
    res.render('about-cooperation', { title: 'Express' });
});
//如何使用
router.get('/about/howtouse', function(req, res, next){
    res.render('about-howtouse', { title: 'Express' });
});


module.exports = router;
