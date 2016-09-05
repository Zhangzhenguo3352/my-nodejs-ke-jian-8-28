# my-nodejs-ke-jian-8-28
```
用 cmd 进入数据库（mysql）
登录数据库: 		mysql -uroot -p 回车
密码：				123456
显现有多少个数据库：show databases;
创建 数据库 user:  create databases;
进入某一个数据库，准备操作。进入user 库准备操作： use user;
增 -》创建一个表 想要 name 、age、id:     create table sas_test(name varchar(10),age int(3),id int(9));	
增 -》在表里写东西：        insert into sas_test(name,age,id) values('zhang','20',1);
 
 现在已经完成了一个标的创建，这个创建时更这个项目结合的，不然不能 正常运行

 我建议用 supervisor my-add-news.js 来启动 及时更新 node

```

```
	www/my-add-news.html
	my-add-new.js
```

```
	


	var http = require('http');
		var mysql = require('mysql');
		var fs = require('fs');
		var urlLie = require('url');
		var os = require('os');
		var cluster = require('cluster'); //集群
		var EventEmitter = require('events').EventEmitter; //解决：深层次回调嵌套

		var os = os.cpus().length; // 电脑有几个 cpu

		if(cluster.isMaster){// 如果是主进程
			//如果是主进程 就分裂
			for(var i=0;i<os;i++){
				// 有几个 cpu 就分裂几次
				cluster.fork() // 分裂的方法
			}
			// 如果 分裂是 这四个进程挂掉
			cluster.on('exit',function(){
				// 挂掉，就马上分裂
				cluster.fork();  
			})
		}else{
			//分裂完成，不是主进程，才到这里
			var E = new EventEmitter();
			http.createServer(function(req,res){
				E.emit('get-parse',req,res)

			}).listen(8081,function(){
				console.log('服务已经启动 8081')
			})
			//获取get 数据
			E.on('get-parse',function(req,res){
				//    拿到的是前端想给服务器发送的数据，也就是 ajax里面的 data:{act:{xxx}},中的 data 一些东西
				// 在这里是    query: { act: 'get', t: '0.8167954389937222' },
				req.get = urlLie.parse(req.url,true).query;
				//    拿到的是 前端ajax 中 url="news" 的news, 
				// 在这里是   pathname: '/news',
				req.url = urlLie.parse(req.url,true).pathname;

				E.emit('buss-start',req,res)


			})

			// 处理是否有人监听
			E.on('buss-start',function(req,res){
				// 它有返回值，true 有人监听，false 没有人监听
				var bool = E.emit(req.url,req,res);
				 if(bool == false){
				 	//如果没有人监听，就开始深层嵌套，读取文件操作
				 	E.emit('read-file',req,res);
				 }
			})
			//开始读取文件
			E.on('read-file',function(req,res){
				// 以 流 的方式读取那个文件
				var rs = fs.createReadStream('www'+req.url);
				// 读取到 多少 ，给服务器多少
				rs.pipe(res)
				//给服务器的时候 出现了 错误的情况，不想让服务器停止下来，只是显示错误信息
				rs.on('error',function(){
					//服务器给浏览器说，调试框警告 404
					res.writeHeader(404);
					//服务器给浏览器说，页面上要写 404
					res.write('404');
					//服务器给浏览器说，别请求了可以停了
					res.end();
				})
				
			})

			//以下处理接口
			E.on('/news',function(req,res){
				var act = req.get.act;
				switch(act){
					case 'get':
						// 前端 给 后台的是 get,就让它获取数据
						E.emit('news-get',req,res);
					break;
					case 'add':
						// 添加数据库内容
						E.emit('news-add',req,res);
					break;	
					case 'user-add':
						E.emit('user-add',req,res)
					break;
					case 'user-login':
						E.emit('user-login',req,res)
					break;
				}
			})
			// 登录用户
			E.on('user-login',function(req,res){
				var name = req.get.title;
				var age = req.get.href;

				var db = mysql.createConnection({
					host:'localhost',
					user:'root',
					password:'123456',
					database:'user'
				});

				var sql = `select * from user where name="${name}"`;

				db.query(sql,function(err,data){
				
					if(err){
						res.end(JSON.stringify({err:2003,msg:'登录时数据库方面有问题'}))
					}else{
						if(data.length){
							//用户存在，数据库里有这个用户
							// data 的信息   [ RowDataPacket { name: 'zas', age: 0, id: 1129 } ]

							if(data[0].age == age){// 拿到了，用户名的 密码 === 现在我填写的 密码
								// 密码正确
								res.end(JSON.stringify({code:1009,msg:'登录成功'}))
							}else{
								// 密码错误，提醒用户
								res.end(JSON.stringify({code:1010,msg:'密码错误'}))
							}

						}else{
							// 用户不存在，数据库里没有，提醒没有注册
							res.end(JSON.stringify({code:1008,msg:'此用户没有注册,可以注册了'}))
						}
					}
				})
			})
			//注册用户
			E.on('user-add',function(req,res){

				var name = req.get.title;
				var age = req.get.href;

				var db = mysql.createConnection({
					host:'localhost',
					user:'root',
					password:'123456',
					database:'user'
				});
				var sql = `select * from user where name="${name}"`;

				db.query(sql,function(err,data){
					
					if(err){
						// 数据库里 有这个字段name 
						res.end(JSON.stringify({err:2222,msg:'数据库方面有问题'}));
					}else{
						// 数据库有这个字段，提醒注册用户，已经存在，不能注册
						if(data.length){
							res.end(JSON.stringify({err:2223,msg:'用户名已经存在，不能注册'}))
						}else{
							var sql = `insert into user values("${name}","${age}",null)`;

							db.query(sql,function(err,data){
								if(err){
									res.end(JSON.stringify({code:1006,msg:'注册时数据库有问题'}))
								}else{
										
									res.end(JSON.stringify({code:1005,msg:'注册用户成功'}))
								}
							})




							
						}
					}
				})
			})
			//获取数据，就是要链接数据库了。从数据库里去数据
			E.on('news-get',function(req,res){
				//准备链接数据库
				var db = mysql.createConnection({
					host:'localhost', // 服务器名字
					user:'root',      // 用户名
					password:'123456',// 密码
					database:'user'   // 数据库名字
				})

				var sql = `select name,age,null from user `;
				db.query(sql,function(err,data){
					if(err){
						//链接数据库失败
						//JSON.stringify()  转成真正的 json数据， {a:1,b:2,c:3} -> '{"a":1, "b":2}'
						res.end(JSON.stringify({code:1001,msg:'链接数据库失败'}))
					}else{
						// code 我来规定 code 1003是成功，前台可以拿 code 来得到是否成功
						res.end(JSON.stringify({code:1003,msg:'获取数据库内容成功',data:data}))
					}
				})
			})
			//添加数据
			E.on('news-add',function(req,res){
				var title = req.get.title;
				var href = req.get.href;
			

				var db = mysql.createConnection({
					host:'localhost',
					user:'root',
					password:'123456',
					database:'user'
				})
				var sql = `insert into user values("${title}","${href}",null)`;
				db.query(sql,function(err,data){
					if(err){
						res.end(JSON.stringify({code:1001,msg:'数据库连接失败'}))
					}else{
						res.end(JSON.stringify({code:1003,msg:'添加数据库成功',data:data}))
					}
				})
			})
		}


```