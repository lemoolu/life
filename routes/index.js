var express = require('express');
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
    var resData = {
        cookie : req.cookies,
        login : {
            isLogin : false,
            icon : null,
            userName : null
        },
        title : '生活嘉兴',
        data : {},
        onGetData : function(){}
    };

    console.log(resData.cookie);
    res.locals.resData = resData;

    //判断是否登陆

    res.locals.loginData = {
        isLogin : false,
        icon : null,
        userName : null
    };
    next();
});


var cookie = '';

//首页
router.get('/', function(req, res, next) {

    console.log(res.locals.loginData);

    var reqData = {
        "pageNumber": 1,
        "pageSize": 15,
        "property": null,
        "keyword": null,
        "orderBy": 'dateCreated',
        //"orderType": "desc",
        "condition": {
        }
    };
    var data = {
        login : res.locals.loginData,
        type : 'dateCreated',
        title : '生活嘉兴',
        list : null,
        hotTag : null,
        tag : null
    };
    Activity.GetActivities(JSON.stringify(reqData)).withCookie(cookie).done(function(_res){
        Activity.GetTags().withCookie(cookie).done(function(_tag){
            Activity.GetHotTags().withCookie(cookie).done(function(_hotTag){
                data.list = _res.data.list;
                data.tag = _tag.data;
                data.hotTag = _hotTag.data;
                console.log(data.list);
                console.log(data.tag);
                console.log(data.hotTag);
                res.render('index', data);
            });
        });
    })
});

router.use('/index', function(req, res, next){
    res.locals.resData.data = {
        type : 'dateCreated',
        title : '生活嘉兴',
        list : null,
        hotTag : null,
        tag : null
    };
    res.locals.resData.onGetData = function(callback){
        Activity.GetActivities(JSON.stringify(reqData)).withCookie(cookie).done(function(_res){
            Activity.GetTags().withCookie(cookie).done(function(_tag){
                Activity.GetHotTags().withCookie(cookie).done(function(_hotTag){
                    res.locals.resData.data.list = _res.data.list;
                    res.locals.resData.data.tag = _tag.data;
                    res.locals.resData.data.hotTag = _hotTag.data;
                    callback && callback();
                    //res.render('index', res.locals.resData);
                });
            });
        })
    };
    next();
});

//首页 按时间排序
router.get('/index/dateCreated', function(req, res, next) {

    var resData = res.locals.resData;
    console.log(resData);

    var reqData = {
        "pageNumber": 1,
        "pageSize": 15,
        "property": null,
        "keyword": null,
        "orderBy": 'dateCreated',
        //"orderType": "desc",
        "condition": {
        }
    };
    var data = {
        login : res.locals.loginData,
        type : 'dateCreated',
        title : '生活嘉兴',
        list : null,
        hotTag : null,
        tag : null
    };
    Activity.GetActivities(JSON.stringify(reqData)).withCookie(cookie).done(function(_res){
        Activity.GetTags().withCookie(cookie).done(function(_tag){
            Activity.GetHotTags().withCookie(cookie).done(function(_hotTag){
                data.list = _res.data.list;
                data.tag = _tag.data;
                data.hotTag = _hotTag.data;
                console.log(data.list);
                console.log(data.tag);
                console.log(data.hotTag);
                res.render('index', data);
            });
        });
    })
});
//首页 按推荐排序
router.get('/index/recommended', function(req, res, next) {
    var reqData = {
        "pageNumber": 1,
        "pageSize": 15,
        "property": null,
        "keyword": null,
        "orderBy": 'recommended',
        //"orderType": "desc",
        "condition": {
        }
    };
    var data = {
        login : res.locals.loginData,
        type : 'recommended',
        title : '生活嘉兴',
        list : null,
        hotTag : null,
        tag : null
    };
    Activity.GetActivities(JSON.stringify(reqData)).withCookie(cookie).done(function(_res){
        Activity.GetTags().withCookie(cookie).done(function(_tag){
            Activity.GetHotTags().withCookie(cookie).done(function(_hotTag){
                data.list = _res.data.list;
                data.tag = _tag.data;
                data.hotTag = _hotTag.data;
                console.log(data.list);
                console.log(data.tag);
                console.log(data.hotTag);
                res.render('index', data);
            });
        });
    })
});
//首页 分类
router.get('/index/sort/:tagId/:tagName', function(req, res, next) {
    var reqData = {
        "pageNumber": 1,
        "pageSize": 15,
        "property": null,
        "keyword": null,
        "orderBy": 'dateCreated',
        //"orderType": "desc",
        "condition": {
            tagId : req.params.tagId
        }
    };
    var data = {
        login : res.locals.loginData,
        type : 'sortTag',
        tagName : req.params.tagName,
        title : '生活嘉兴',
        list : null,
        hotTag : null,
        tag : null
    };
    Activity.GetActivities(JSON.stringify(reqData)).withCookie(cookie).done(function(_res){
        Activity.GetTags().withCookie(cookie).done(function(_tag){
            Activity.GetHotTags().withCookie(cookie).done(function(_hotTag){
                data.list = _res.data.list;
                data.tag = _tag.data;
                data.hotTag = _hotTag.data;
                console.log(data.list);
                console.log(data.tag);
                console.log(data.hotTag);
                res.render('index', data);
            });
        });
    })
});
//首页 搜索
router.get('/index/search/:key', function(req, res, next) {
    var reqData = {
        "pageNumber": 1,
        "pageSize": 15,
        "property": null,
        "keyword": req.params.key,
        "orderBy": 'dateCreated',
        "condition": {
        }
    };
    var data = {
        login : res.locals.loginData,
        type : 'search',
        keyWord : req.params.key,
        title : '生活嘉兴',
        list : null,
        hotTag : null,
        tag : null
    };
    Activity.GetActivities(JSON.stringify(reqData)).withCookie(cookie).done(function(_res){
        Activity.GetTags().withCookie(cookie).done(function(_tag){
            Activity.GetHotTags().withCookie(cookie).done(function(_hotTag){
                data.list = _res.data.list;
                data.tag = _tag.data;
                data.hotTag = _hotTag.data;
                console.log(data.list);
                console.log(data.tag);
                console.log(data.hotTag);
                res.render('index', data);
            });
        });
    })
});





//登陆
router.get('/users/login', function(req, res, next){
    var resData = res.locals.loginData;
    resData.title = '';
    res.render('users-login', resData);
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
    res.render('users-signup', { title: 'Express' });
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
