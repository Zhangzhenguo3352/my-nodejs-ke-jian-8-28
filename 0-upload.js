

var http = require('http');
var fs = require('fs');
// 这个页面演示下错误时，报 404 而不停止服务
http.createServer(function(req,res){
	// req/读取流, 客户端  = 》 服务器的
	// res/写入流, 服务器  = 》 客户端的
	// substring(1)  从头到位拿到字符串的长度
	var rs = fs.createReadStream(req.url.substring(1));
	console.log(req.url.substring(1))
	rs.pipe(res);  // 仅仅是是把访问者的url 数据 通过管道，给了 res，也就是客户端了
	rs.on('error',function(){ // 加入错误的情况出现，不让服务器停止，只让在页面上显示 404
		res.writeHeader(404);
		res.write('404');
		res.end();  // 服务器 说 浏览器你 别等了停了吧。
	})
	
}).listen(8082);


































