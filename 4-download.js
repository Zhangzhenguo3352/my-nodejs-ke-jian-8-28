
//下载下来，还有添加后缀
var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function(req,res){
    var rs = fs.createReadStream(req.url.substring(1));
    // req.url     拿到 / 404.jpg
    // path.extname(req.url)  拿到 .jpg
    var extname=path.extname(req.url);
    var filename = Date.now();
    // 下载了 时间戳 + .jpg
    res.setHeader('content-disposition','attachment;filename="'+filename+extname+'"');
    rs.pipe(res);
}).listen(8081);