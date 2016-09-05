
// 编写一个，读写本地路径的方法很头疼，及访问那个下载那个文件
var http = require('http');
var fs  = require('fs');

http.createServer(function(req,res){
	var rs = fs.createReadStream(req.url.substring(1));
	// 访问这个服务，下面的文件，就下载哪一个文件,这里我下载了404.jpg,用这个访问(http://localhost:8081/404.jpg) 
	res.setHeader('content-disposition','attachment'); // 下载肯定是下载到，浏览器里面了。不在文件夹中
	rs.pipe(res)
}).listen(8081)