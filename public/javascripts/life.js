var Life = {};

//项目配置
Life.Host = 'http://127.0.0.1:8808';
Life.JavaHost = 'http://127.0.0.1:8080';

//Life.Host = 'http://www.lifejx.com';
//Life.JavaHost = 'http://www.lifejx.com:8080';

//错误代码
Life.ErrorCode = {
    '001' : '参数格式不正确',
    '002' : '需要管理员或用户登陆',
    '003' : '未知错误',

    '101' : '当前用户需要登录',
    '102' : '当前用户无此操作权限',
    '103' : '验证码无效',
    '104' : '用户名或密码无效',
    '105' : '该用户已存在',
    '109' : '您已经报名了该活动，不能再次报名，如果想重新报名，请先到我的活动中取消报名。',

    '201' : '当前用户需要登录',
    '202' : '当前用户无此操作权限',
    '203' : '验证码无效',
    '204' : '用户名或密码无效',
    '205' : '审核锁定',
    '1001' : '修改密码失败，原密码错误。'
};
//表单内容转对象
Life.FormToJson = function($form){
    var array = $form.serializeArray();
    var json = {};
    for(var i in array){
        json[array[i]['name']] = array[i]['value'];
    }
    return json;
};
//md5加密
Life.Md5Encrypt = function(str){
    return $.md5(str);
};