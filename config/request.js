var express = require('express');
var Life = require('../config/life');

var ModelProxy = require( '../lib/modelproxy/modelproxy');

//var prep = 'http://127.0.0.1:8080';
//var online = 'http://www.lifejx.com:8080';


var interface = {
    "title": "life api",
    "version": "1.0.0",
    "status": 'online',
    "interfaces": [
    {
        "name": "活动 创建",
        "desc": "",
        "id": "Activity.Create",
        "urls": {
            "online": Life.JavaHost + "/life/activity/create"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 编辑",
        "desc": "",
        "id": "Activity.Modify",
        "urls": {
            "online": Life.JavaHost + "/life/activity/modify"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 添加内容",
        "desc": "",
        "id": "Activity.AddContent",
        "urls": {
            "online": Life.JavaHost + "/life/activity/add/content"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 删除内容",
        "desc": "",
        "id": "Activity.DelContent",
        "urls": {
            "online": Life.JavaHost + "/life/activity/delete/content"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 提交审核",
        "desc": "",
        "id": "Activity.Commit",
        "urls": {
            "online": Life.JavaHost + "/life/activity/commit/verify"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 获取所有活动",
        "desc": "",
        "id": "Activity.GetActivities",
        "urls": {
            "online": Life.JavaHost + "/life/activity/get/activities"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 根据活动id获取活动详情",
        "desc": "",
        "id": "Activity.GetById",
        "urls": {
            "online": Life.JavaHost + "/life/activity/get"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 活动报名",
        "desc": "",
        "id": "Activity.AddMember",
        "urls": {
            "online": Life.JavaHost + "/life/activity/add/member"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 获取报名列表",
        "desc": "",
        "id": "Activity.GetMember",
        "urls": {
            "online": Life.JavaHost + "/life/activity/get/members"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 报名审核",
        "desc": "",
        "id": "Activity.CheckMember",
        "urls": {
            "online": Life.JavaHost + "/life/activity/check/member"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 获取热门标签",
        "desc": "",
        "id": "Activity.GetHotTags",
        "urls": {
            "online": Life.JavaHost + "/life/activity/get/hot/tags"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 获取相关标签",
        "desc": "",
        "id": "Activity.GetTags",
        "urls": {
            "online": Life.JavaHost + "/life/activity/get/tags"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 关注活动",
        "desc": "",
        "id": "Activity.Attention",
        "urls": {
            "online": Life.JavaHost + "/life/activity/set/attention"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
        "name": "活动 判断用户是否已关注该活动",
        "desc": "",
        "id": "Activity.IsAttention",
        "urls": {
            "online": Life.JavaHost + "/life/activity/attention/check"
        },
        "method": "post",
        "isCookieNeeded": true
    },{
            "name": "活动 获取热门活动",
            "desc": "",
            "id": "Activity.GetHotActivities",
            "urls": {
                "online": Life.JavaHost + "/life/activity/get/activities/hot"
            },
            "method": "post",
            "isCookieNeeded": true
        },




    {
        "name": "用户 注册",
        "desc": "",
        "id": "User.Register",
        "urls": {
            "online": Life.JavaHost + "/life/user/register"
        },
        "method": "post",
        "isCookieNeeded": true
    },
    {
        "name": "用户 登陆",
        "desc": "",
        "id": "User.Login",
        "urls": {
            "online": Life.JavaHost + "/life/user/login"
        },
        "method": "post",
        "isCookieNeeded": true
    },
    {
        "name": "用户 用户名是否存在",
        "desc": "",
        "id": "User.AccountValidate",
        "urls": {
            "online": Life.JavaHost + "/life/user/check_exist"
        },
        "method": "post",
        "isCookieNeeded": true
    },
    {
        "name": "用户 获取验证码",
        "desc": "",
        "id": "User.GetCheckCode",
        "urls": {
            "online": Life.JavaHost + "/life/common/get/checkCode"
        },
        "method": "post",
        "isCookieNeeded": true
    },
    {
        "name": "用户 判断登陆状态",
        "desc": "",
        "id": "User.GetLoginStatus",
        "urls": {
            "online": Life.JavaHost + "/life/user/check/loginStatus"
        },
        "method": "post",
        "isCookieNeeded": true
    },
    {
        "name": "用户 是否要填验证码",
        "desc": "",
        "id": "User.HasCheckCode",
        "urls": {
            "online": Life.JavaHost + "/life/user/check/checkCode"
        },
        "method": "post",
        "isCookieNeeded": true
    },
    {
        "name": "用户 注销",
        "desc": "",
        "id": "User.Logout",
        "urls": {
            "online": Life.JavaHost + "/life/user/log_off"
        },
        "method": "post",
        "isCookieNeeded": true
    },
    {
        "name": "用户 获取用户发起的活动 0：待审核，1：审核通过，2：审核不通过，3：草稿箱",
        "desc": "",
        "id": "User.GetMyActivities",
        "urls": {
            "online": Life.JavaHost + "/life/activity/get/user/activities"
        },
        "method": "post",
        "isCookieNeeded": true
    },
    {
        "name": "用户 根据id获取用户发起的活动",
        "desc": "",
        "id": "User.GetActivitiesById",
        "urls": {
            "online": Life.JavaHost + "/life/activity/get/user/activity"
        },
        "method": "post",
        "isCookieNeeded": true
    },
    {
        "name": "用户 获取用户参与的活动",
        "desc": "",
        "id": "User.GetActJoined",
        "urls": {
            "online": Life.JavaHost + "/life/activity/get/user/activities/join"
        },
        "method": "post",
        "isCookieNeeded": true
    },
    {
        "name": "用户 获取用户收藏的活动",
        "desc": "",
        "id": "User.GetActAttention",
        "urls": {
            "online": Life.JavaHost + "/life/activity/get/user/activities/attention"
        },
        "method": "post"
    },
    {
        "name": "用户 取消活动报名",
        "desc": "",
        "id": "User.CancelMember",
        "urls": {
            "online": Life.JavaHost + "/life/activity/cancel/member"
        },
        "method": "post"
    },
    {
        "name": "用户 获取用户详细信息",
        "desc": "",
        "id": "User.GetInfo",
        "urls": {
            "online": Life.JavaHost + "/life/user/get/info"
        },
        "method": "post"
    },
    {
        "name": "用户 编辑用户信息",
        "desc": "",
        "id": "User.EditInfo",
        "urls": {
            "online": Life.JavaHost + "/life/user/set/info"
        },
        "method": "post"
    },
    {
        "name": "用户 用户修改密码",
        "desc": "",
        "id": "User.ModifyPassword",
        "urls": {
            "online": Life.JavaHost + "/life/user/modify/password"
        },
        "method": "post"
    },
    {
        "name": "用户 获取微信登陆地址",
        "desc": "",
        "id": "User.GetWechatPath",
        "urls": {
            "online": Life.JavaHost + "/life/user/get/wechat/path"
        },
        "method": "post"
    },
    {
        "name": "用户 获取用户消息",
        "desc": "",
        "id": "User.GetMessage",
        "urls": {
            "online": Life.JavaHost + "/life/user/get/messages"
        },
        "method": "post"
    },

    {
        "name": "图片上传切割",
        "desc": "",
        "id": "User.ImageCut",
        "urls": {
            "online": Life.JavaHost + "/life/common/image/cut"
        },
        "method": "post"
    },
        {
            "name": "发送密码修改邮件",
            "desc": "",
            "id": "User.ForgetPassWord",
            "urls": {
                "online": Life.JavaHost + "/life/user/send/email/for/password"
            },
            "method": "post"
        },
        {
            "name": "进入可直接修改密码状态",
            "desc": "",
            "id": "User.ModifyChangePasswordStatus",
            "urls": {
                "online": Life.JavaHost + "/life/user/modify/password/by/email"
            },
            "method": "post"
        },
        {
            "name": "直接修改密码",
            "desc": "",
            "id": "User.ForgetChangePassword",
            "urls": {
                "online": Life.JavaHost + "/life/user/modify/password/directly"
            },
            "method": "post"
        },



    {
        "name": "管理员 获取审核列表",
        "desc": "",
        "id": "Admin.GetActList",
        "urls": {
            "online": Life.JavaHost + "/life/core/manage/verify/get/page"
        },
        "method": "post"
    },
    {
        "name": "管理员 锁定审核",
        "desc": "",
        "id": "Admin.Lock",
        "urls": {
            "online": Life.JavaHost + "/life/core/manage/verify/lock/activity"
        },
        "method": "post"
    },
    {
        "name": "管理员 审核活动",
        "desc": "",
        "id": "Admin.CheckAct",
        "urls": {
            "online": Life.JavaHost + "/life/core/manage/verify/activity"
        },
        "method": "post"
    },
    {
        "name": "管理员 获取活动审核进度",
        "desc": "",
        "id": "Admin.GetActProcess",
        "urls": {
            "online": Life.JavaHost + "/life/core/manage/manager/get/process"
        },
        "method": "post"
    },
    {
        "name": "管理员 设置活动标签",
        "desc": "",
        "id": "Admin.SetActTag",
        "urls": {
            "online": Life.JavaHost + "/life/core/manage/verify/set/tag"
        },
        "method": "post"
    },
    {
        "name": "管理员 删除活动标签",
        "desc": "",
        "id": "Admin.DeleteActTag",
        "urls": {
            "online": Life.JavaHost + "/life/core/manage/verify/delete/tag"
        },
        "method": "post"
    },
    {
        "name": "管理员 设置推荐活动",
        "desc": "",
        "id": "Admin.SetRecommendAct",
        "urls": {
            "online": Life.JavaHost + "/life/core/manage/activity/recommended"
        },
        "method": "post"
    }
]
};

var app = express();
ModelProxy.init( interface );
app.use( '/model', ModelProxy.Interceptor );

var User = new ModelProxy('User.*');
var Activity = new ModelProxy('Activity.*');

var Req = {};
Req.User = User;
Req.Activity = Activity;
Req.config = interface;


module.exports = Req;