const express = require('express');
//引入连接池对象
const pool=require('../pool.js')
//创建路对象由器
var router = express.Router();
//1.注册路由   
router.post('/reg', function (req, res) {
    //获取post请求的数据
    var obj = req.body;
    //验证每一项是否为空
    //如果用户名为空
    if (!obj.uname) {
        res.send({ code: 401, msg: 'uname required' });
        //结束函数执行
        return;
    }
    if (!obj.upwd) {
        res.send({ code: 402, msg: 'upwd required' });
        //结束函数执行
        return;
    }
    if (!obj.phone) {
        res.send({ code: 403, msg: 'phone required' });
        //结束函数执行
        return;
    }
    if (!obj.email) {
        res.send({ code: 404, msg: 'email required' });
        //结束函数执行
        return;
    }
    //执行SQL语句
    pool.query('INSERT INTO xz_user SET ?',[obj],function(err,result){
    if (err) throw err;
        //如果插入成功
        if(result.affectedRows>0){
            res.send({code:200,msg:'reg suc'});
        }
    })
});
//2.登录路由
router.post('/login',function(req,res){
    //获取数据
    var obj=req.body; 
    //验证数据是否为空
    if (!obj.uname) {
        res.send({ code: 401, msg: 'uname required' });
        return;
    }
    if (!obj.upwd) {
        res.send({ code: 402, msg: 'upwd required' });
        return;
    }
    //执行SQL语句
    //查询是否有用户名和密码同时匹配的数据
    pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],function(err,result){
        if(err) throw err;
        //console.log(result);  

        //判定登录成功还是失败
        if(result.lenght>0){//有元素，成功
            res.send({code:200,msg:'login suc'});
        }   
        else {//没有元素。失败
            res.send({code:201,msg:'uname or upwd error'})
        }
    });
});
//3.检索用户路由
router.get('/detail',function(req,res){
    //获取数据
    var obj=req.query;
    //验证数据是否为空
    if (!obj.uid) {
        res.send({ code: 401, msg: 'uid required' });
    }
    //执行SQL语句
    pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
    if (err) throw err;
    //console.log(result);
    res.send(result);
    });
});
//4.修改用户路由
router.post('/update',function(req,res){
    var obj=req.body
    //验证数据是否为空
    //遍历对象，访问每个属性
    var i=400;
    for(var key in obj){
        i++;
        //如果属性为空，提示属性名必须
        if(!obj[key]){
            res.send({code:i,msg:key+'require'});
            return;
        }
    }
    //取出用户编号
    var uid=obj.uid;
    //删除对象中的编号属性
    delete obj.uid;
    //console.log(obj);
    //执行SQL语句
    pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,uid],function(err,result){
        if(err) throw err;
        //console.log(result);
        //判断是否修改成功
        if(result.affectedRows>0){
            res.send({code:200,msg:'update suc'})
        }else{
            res.send({code:201,msg:'update error'})
        }
    });
})
//5.用户列表
router.get('st',function(req,res){
    var obj=req.query;
    //console.log(obj);
    //验证为空，设置默认值
    var count=obj.count;
    var pno=obj.pno;
    if(!count){
        count=5;
    }
    if(!pno){
        pno=1;
    }
    //console.log( count,pno );
    //转整型
    count=parseInt(count);
    pno=parseInt(pno);
    //计算开始的值  开始=（页码-1）*大小
    var start=(pno-1)*count;
    //执行SQL语句
    pool.query('SELECT * FROM xz_user LIMIT ?,?',[start,count],function(err,result){
        if(err) throw err;
        res.send(result);
    });
});
//6.删除用户
router.get('/delete',function(req,res){
    var obj=req.query;
    //验证为空
    if(!obj.uid){
        res.send({ code: 401, msg: 'uid required' });
    }
    //执行SQL语句
    pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
        if(err) throw err;
        //判断是否删除成功
        if(result.affectedRows>0){
            res.send({code:200,msg:'delete suc'});
        }
        else{
            res.send({code:301,msg:'delete err'})
        }
    });
});

//导出路由器对象
module.exports = router;
