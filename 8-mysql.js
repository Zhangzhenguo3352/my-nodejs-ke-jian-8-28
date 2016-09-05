
const mysql = require('mysql');

var db = mysql.createConnection({
        host:'localhost',  // 服务器名字
        user:'root',
        password:'123456',
        database:'name1'  // 库里面 的具体哪一个库
})
// 这里做了 筛选，只查 name
db.query('select name from username',function(err,data){
        if(err){
            console.log('数据库有问题');
        }else{
            console.log(data) // [ RowDataPacket { name: '1' } ]
        }
})
