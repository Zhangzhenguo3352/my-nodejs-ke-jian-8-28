var http = require('http');
var fs = require('fs');

http.createServer(function(req,res){
    var rs = fs.createReadStream(req.url.substring(1));
    // 访问方法，http://localhost:8081/404.jpg   ，
    // 添加了 第二个参数  访问完了，下载下来给它起了个名字， aaaaa.txt
    res.setHeader('content-disposition','attachment;filename="aaaaa.txt"');
    rs.pipe(res)
}).listen(8081)