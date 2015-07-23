var express = require('express');
var extend = require('node.extend');
var router = express.Router();
var app = express();

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
            userId : null,
            userName : null
        },
        title : '生活嘉兴',
        data : {},
        onGetData : function(){}
    };

    //判断是否登陆
    User.GetLoginStatus().withCookie(res.locals.resData.cookies).done(function(loginRes){
        console.log(loginRes);
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
            "pageSize": 15,
            "property": null,
            "keyword": null,
            "orderBy": 'dateCreated',
            "condition": {
            }
        }
    };

    Activity.GetActivities(JSON.stringify(res.locals.resData.data.reqData))
        .GetTags()
        .GetHotTags()
        .withCookie(res.locals.resData.cookies)
        .done(function(_res, _tag, _hotTag){
            res.locals.resData.data.list = _res.data.list;
            res.locals.resData.data.tag = _tag.data;
            res.locals.resData.data.hotTag = _hotTag.data;
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
        Activity.GetActivities(JSON.stringify(res.locals.resData.data.reqData))
            .GetTags()
            .GetHotTags()
            .withCookie(res.locals.resData.cookies)
            .done(function(_res, _tag, _hotTag){
                res.locals.resData.data.list = _res.data.list;
                res.locals.resData.data.tag = _tag.data;
                res.locals.resData.data.hotTag = _hotTag.data;
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
//注册
router.get('/users/signup', function(req, res, next){
    res.render('users-login', res.locals.resData);
});



//个人详情
router.get('/users/info', function(req, res, next){
    User.GetInfo()
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData){
            res.locals.resData.data = _resData.data;
            console.log(res.locals.resData.data);
            res.render('users-info', res.locals.resData);
        });
});
//个人详情 编辑页面
router.get('/users/info/edit', function(req, res, next){
    res.render('users-info-edit', res.locals.resData);
});
//个人信息页面
router.get('/users/message', function(req, res, next){
    res.render('users-message', res.locals.resData);
});

//个人活动公共
router.use('/users/activities/', function(req, res, next){
    res.locals.resData.data = {
        type : 'draft',
        list : null,
        hotTag : null,
        tag : null,
        list : [],
        reqData : {
            "pageNumber": 1,
            "pageSize": 15,
            "orderType": "desc",
            "condition" : null
        }
    };
    next();
});
//我的活动 草稿箱
router.get('/users/activities/draft', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 3,
        reqData : {
            "condition" : {
                "status" : 3
            }
        }
    });
    User.GetMyActivities(JSON.stringify(res.locals.resData.data.reqData))
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData){
            if(_resData.success == true)
                res.locals.resData.data.list = _resData.data.list;
            res.render('users-activities', res.locals.resData);
        });
});
//我的活动 审核中
router.get('/users/activities/auditing', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 2,
        reqData : {
            "condition" : {
                "status" : 2
            }
        }
    });
    User.GetMyActivities(JSON.stringify(res.locals.resData.data.reqData))
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData){
            if(_resData.success == true)
                res.locals.resData.data.list = _resData.data.list;
            res.render('users-activities', res.locals.resData);
        });
});
//我的活动 成功发起的
router.get('/users/activities/published', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 1,
        reqData : {
            "condition" : {
                "status" : 1
            }
        }
    });
    User.GetMyActivities(JSON.stringify(res.locals.resData.data.reqData))
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData){
            if(_resData.success == true)
                res.locals.resData.data.list = _resData.data.list;
            res.render('users-activities', res.locals.resData);
        });
});
//我的活动 审核不通过
router.get('/users/activities/publishfailed', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 0,
        reqData : {
            "condition" : {
                "status" : 0
            }
        }
    });
    User.GetMyActivities(JSON.stringify(res.locals.resData.data.reqData))
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData){
            if(_resData.success == true)
                res.locals.resData.data.list = _resData.data.list;
            res.render('users-activities', res.locals.resData);
        });
});
//我的活动 我参与的
router.get('/users/activities/joinin', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 4
    });
    User.GetActJoined(JSON.stringify(res.locals.resData.data.reqData))
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData){
            if(_resData.success == true)
                res.locals.resData.data.list = _resData.data.list;
            res.render('users-activities', res.locals.resData);
        });
});
//我的活动 收藏夹
router.get('/users/activities/collection', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 5
    });
    User.GetActAttention(JSON.stringify(res.locals.resData.data.reqData))
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData){
            if(_resData.success == true)
                res.locals.resData.data.list = _resData.data.list;
            res.render('users-activities', res.locals.resData);
        });
});


//活动列表展示（主页 ）
router.get('/activity/add', function(req, res, next){
});
//活动添加
router.get('/activity/add', function(req, res, next){
});
//活动详情
router.get('/activity/detail/:id?', function(req, res, next){
    Activity.GetById(req.params.id)
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData){
            console.log(_resData);
            res.locals.resData.data = _resData.data;
            res.render('activity-detail', res.locals.resData);
        })
});


//关于我们
router.get('/about/aboutus', function(req, res, next){
    res.render('about-aboutus', res.locals.resData);
});
//寻求合作
router.get('/about/cooperation', function(req, res, next){
    res.render('about-cooperation', res.locals.resData);
});
//如何使用
router.get('/about/howtouse', function(req, res, next){
    res.render('about-howtouse', res.locals.resData);
});


module.exports = router;
