/**
 * Created by strive-智能社 on 2016/8/28.
 */

 // news_get.html 和 add_news.html 应该访问的文件
const http=require('http');
const EventEmitter=require('events').EventEmitter;
const fs=require('fs');
const urlLib=require('url');
const mysql=require('mysql');
const cluster=require('cluster');
const os=require('os');

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
    E.on('/news',function(req,res){
        var act=req.get.act;
        /*if(act=='add'){
         //添加新闻
         E.emit('news-add',req,res);
         }*/
        switch (act){
            case 'add':
                E.emit('news-add',req,res);
                break;
            case 'get':
                E.emit('news-get',req,res);
                break;
        }
    });

    E.on('news-add',function(req,res){
        var title=req.get.title;
        var href=req.get.href;

        //连接数据库
        var db=mysql.createConnection({
            host:   'localhost',
            user:   'root',
            password:   '123456',
            database:   'user'
        });
        //往数据库中添加数据
        //var sql='INSERT INTO news VALUES(null,"'+title+'","'+href+'")';
        var sql=`INSERT INTO user VALUES("${title}","${href}",null)`;

        db.query(sql,function(err,data){
            if(err){
                res.end(JSON.stringify({code:1001,msg:"数据库方面有错"}));
            }else{
                res.end(JSON.stringify({code:1002,msg:"新闻添加成功"}));
            }
        });
    });

    E.on('news-get',function(req,res){
        //连接数据库
        var db=mysql.createConnection({
            host:   'localhost',
            user:   'root',
            password:   '123456',
            database:   'user'
        });
        //获取数据
        var sql=`SELECT name,age,null FROM user`;

        db.query(sql,function(err,data){
            if(err){
                res.end(JSON.stringify({code:1001,msg:"数据库方面有错"}));
            }else{
                res.end(JSON.stringify({code:1003, msg:"获取新闻成功", data:data}));
            }
        });
    });

}






































