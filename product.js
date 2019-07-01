//导入express模块
const express=require('express');
//引入连接池对象
const pool=require('../pool.js');
//创建商品路由器
var product=express.Router();
//商品列表
product.get('/list',function(req,res){
	var obj=req.query;
	//console.log(req.query);
	var count=obj.count;
    var pno=obj.pno;
    if(!count){
        count=5;
    }
    if(!pno){
        pno=1;
    }
    count=parseInt(count);
    pno=parseInt(pno);
    var start=(pno-1)*count;
    pool.query('SELECT * FROM xz_laptop LIMIT ?,?',[start,count],function(err,result){
    	if(err) throw err;
    	res.send(result);
    });
});
//商品详情
product.get('/detail',function(req,res){
	var obj=req.query;
	//console.log(obj);
	if(!obj.lid){
		res.send({code:'400',msg:'lid required'});
		// return;
	}
	pool.query('SELECT * FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
		if(err) throw err;
		res.send(result);
	});

});
product.get('/delete',function(req,res){
	var obj=req.query;
	if(!obj.lid){
		res.send({ code: 401,msg:'lid required'});
		pool.query('DELETE * FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
            res.send({code:200,msg:'delete suc'});
        }
        else{
            res.send({code:301,msg:'delete err'})
        }
	});

	}
});
	
	

	



module.exports=product;
