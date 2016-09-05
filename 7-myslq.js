
const mysql = require('mysql');
// 这个页面想说明的是
// 1, 安装了 mysql ,npm install --save mysql
// 2, 链接数据库
// 3, 使用spl 语句，并 用js 的方式 去除 name 字段
var db = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'123456',
        database:'name2'
});
//query 查询
// 表名是什么： show tables;   // username
db.query('select * from username',function(err,data){
    //console.log(data)
    /*
    [ RowDataPacket { name: '1', age: 33, txt: '2' },
      RowDataPacket { name: '1', age: 26, txt: 'sas' },
      RowDataPacket { name: 'zhang', age: 26, txt: 'sas' }
    ]
    */
    if(err){
        console.log('数据库方面有问题');
    }else{
        var _data = Array.from(data);

        _data.forEach(function(item,index){
            // 我想删除 name 怎么写
            delete item.name
        })
        console.log(data)
        /*
        [ RowDataPacket { age: 33, txt: '2' },
          RowDataPacket { age: 26, txt: 'sas' },
          RowDataPacket { age: 26, txt: 'sas' }
        ]
        */
    }
})