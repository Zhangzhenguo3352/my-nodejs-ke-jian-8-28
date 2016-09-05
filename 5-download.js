// 一个完整的 下载文件例子
var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function(req,res){
    var rs = fs.createReadStream(req.url.substring(1));
    var arr = ['.jpg','.png','.exe'];
    var extname = path.extname(req.url);
    console.log(extname)  // 点加后缀名
    if(arr.indexOf(extname) !=-1){ // 后缀，有这个
        var filename=Date.now();
        res.setHeader('content-disposition','attachment;filename="'+filename+extname+'"');
        rs.pipe(res); // 服务器 = 》 客户端 让它执行
    }else{  // 后缀，没有这个
        rs.pipe(res)  // 流给了 res ,服务器 给了客户端东西
    }

    rs.on('error',function(){
        res.writeHeader(404) // 服务器，然客户端 报一个 404 错误
        res.write('404') // 页面显示 404
        res.end()
    })
}).listen(8081);