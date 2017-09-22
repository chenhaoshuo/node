
/*setTimeout(function(){
    console.log(111);
},0);

process.nextTick(function(){
    console.log(222)    //先输出222,再输出111
});*/


process.nextTick(function(){
    console.log("nextTick延迟执行");
});
setImmediate(function(){
    console.log("setImmediate延迟执行");
});
console.log("正常执行");
