/**
 * Created by strive-智能社 on 2016/8/28.
 */
const crypto=require('crypto');
function md5(str){
    var obj=crypto.createHash('md5');
    obj.update(str);
    return obj.digest('hex');
}

exports.md5=md5;





































