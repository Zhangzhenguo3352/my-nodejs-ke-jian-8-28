/**
 * Created by strive-智能社 on 2016/8/28.
 */

 //  页面 user.html 应该访问的文件
const http=require('http');
const EventEmitter=require('events').EventEmitter;
const fs=require('fs');
const urlLib=require('url');
const mysql=require('mysql');
const cluster=require('cluster');
const os=require('os');
const md5=require('./md5').md5;

var cpus=os.cpus().length;

if(cluster.isMaster){
    for(var i=0; i<cpus; i++){
        cluster.fork();
    }
    cluster.on('exit',function () {
        cluster.fork();
    });
}else{
    var E=new EventEmitter();

    http.createServer(function(req,res){
        //get
        E.emit('get-parse',req,res);
        console.log('有人来了')

    }).listen(8081);

    E.on('get-parse',function(req,res){
        req.get=urlLib.parse(req.url,true).query;
        req.url=urlLib.parse(req.url,true).pathname;

        E.emit('buss-on',req,res);
    });

    E.on('buss-on',function(req,res){
        var bool=E.emit(req.url,req,res);

        if(bool==false){
            E.emit('read-file',req,res);
        }
    });

    E.on('read-file',function(req,res){
        //页面
        var rs=fs.createReadStream('www'+req.url);
        rs.pipe(res);

        rs.on('error',function(){
            res.writeHeader(404);
            res.write('404');
            res.end();
        });
    });

    //以下处理接口
    E.on('/user',function(req,res){
        //连接数据库
        var db=mysql.createConnection({
            host:   'localhost',
            user:   'root',
            password:   '123456',
            database:   'user'
        });

        //处理具体
        var act=req.get.act;
        switch (act){
            case 'add':
                E.emit('add-user',req,res,db);
                break;
            case 'login':
                E.emit('login-user',req,res,db);
                break;
        }
    });

    E.on('add-user',function(req,res,db){
        var username=req.get.title;
        var password=req.get.href;
       
        var sql=`SELECT * FROM user WHERE name="${username}"`;
        db.query(sql,function(err,data){
            if(err){

                res.end(JSON.stringify({err:1, msg:"数据库方面有问题"}));
            }else{
                if(data.length){
                    res.end(JSON.stringify({err:1, msg:"此用户名已经存在"}));
                }else{
                    var I_SQL=`INSERT INTO user VALUES("${username}","${password}",null)`;
                    db.query(I_SQL,function(err,data){
                        if(err){

                            res.end(JSON.stringify({err:1, msg:"数据库方面有问题"}));
                        }else{
                            res.end(JSON.stringify({err:0, msg:"注册成功"}));
                        }
                    });
                }
            }
        });
    });

    E.on('login-user',function(req,res,db){
        var username=req.get.title;
        var password=req.get.href;

        var sql=`SELECT * FROM user WHERE name="${username}"`;
        db.query(sql,function(err,data){
            if(err){
                res.end(JSON.stringify({err:1, msg:"数据库方面有问题"}));
            }else{
                if(data.length){
                    
                    if(data[0].age==password){
                        res.end(JSON.stringify({err:0, msg:"登录成功"}));
                    }else{
                        res.end(JSON.stringify({err:1, msg:"密码错了"}));
                    }
                }else{
                    res.end(JSON.stringify({err:1, msg:"用户名不存在"}));
                }
            }
        });
    });
}






































