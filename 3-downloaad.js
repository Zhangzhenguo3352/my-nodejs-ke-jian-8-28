
// 为了暂时解决，下载下来的 文件名字一样，我们起个 时间戳名字，
var http = require('http');
var fs = require('fs');

http.createServer(function(req,res){
    var rs = fs.createReadStream(req.url.substring(1));
    var filename = Date.now();
    //访问 http://localhost:8081/404.jpg 下载了 时间戳 名字的文件
    res.setHeader('content-disposition','attachment;filename='+filename+'');
    rs.pipe(res)
}).listen(8081);