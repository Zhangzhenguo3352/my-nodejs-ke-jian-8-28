
// 集群 ，就是 对cpu 的操作
const cluster = require('cluster'); // 启动集群操作的方法
const http = require('http'); // 下面想开启一个服务
const os = require('os') // 启动 计算器 有cpu 个数方法

console.log(111111) // 这里的输出 只是想看看它们分裂的先后过程的
var cpus = os.cpus().length; // 拿到 电脑的 cpu 个数
if(cluster.isMaster){ // 如果是主进程
    //1， 主进程要分列
    console.log('主进程分裂了')
    for(var i=0 ; i<cpus; i++){
        cluster.fork();  // 有几个cpu 分裂几个子进程，
        // 同时当它成为 子进程是，就不是主进程了，就会走else 的方法
        cluster.on('exit',function(){ // exit 事件，在有子进程 崩溃 时 触发
            cluster.fork();  //重新分裂，因为 主进程就会分裂,随后应该是，重新启动了服务
        })
    }

}else{  // 分裂了就来了
    // 这里的代码是，我们写代码的位置，前面的工作只是做了优化
    // cluster.worker.id 只是显现它们的子进程的 id
    /*
    子进程====1
    111111
    子进程====2
    111111
    子进程====3
    111111
    子进程====4
    */
    console.log('子进程===='+cluster.worker.id+'')
    http.createServer(function(req,res){
        // 这里为了演示错误的情况，写了随机数
        // 刷新浏览器你会看到，git 里面 有时会错误，到会马上启动，由主进程 ，马上分裂 子进程
        if(Math.random()<0.5){
            res.we('xxxxxx');
            res.end();
        }else{
            res.write('xxxxxx2');
            res.end();
        }
    }).listen(8081)

}










