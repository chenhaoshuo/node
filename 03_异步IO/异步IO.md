## Node的异步IO ##
事件循环、观察者、请求对象、I/O线程池这四者共同构成了Node异步I/O模型的基本要素。话不多说，看图：

![](https://mmbiz.qpic.cn/mmbiz_png/Zm7gE3cT57ObiaMia98qer0BwTickGj3ibpNcNh4LUh2ialwE492ZQwTSYTib2WMibOAEHwIia6YDiaYlJ52iahr6KxhrQqw/0?wx_fmt=png)

## 非I/O的异步API ##

#### 定时器 ####
setTimeout()和setInterval()与浏览器中的API是一致的，他们的实现原理与异步I/O比较类似，只是不需要I/O线程池的参与。调用setTimeout()或者setInterval()创建的定时器会被插入到定时器观察者内部的一个红黑树中。每次Tick执行，会从该红黑树中迭代取出定时器对象，检查是否超过定时时间，如果超过，就形成一个事件，它的回调函数将立即执行。setTimeout()的行为如下：

![](https://mmbiz.qpic.cn/mmbiz_png/Zm7gE3cT57ObiaMia98qer0BwTickGj3ibpNyK3I5aXObvicO9uxc2cJCLKLmT9tYtCdI662mcvyxUKX2YECuHe63vA/0?wx_fmt=png)

定时器的问题在于，它并非精确的(唉，这个在cvte面试的时候就被问到了)。尽管事件循环十分快，当时如果某一次循环占用的时间较多，那么下次循环式，它也许已经超时很久了。比如通过setTimeout()设定一个函数在10ms之后执行，但在9ms之后，有一个任务占用了5毫秒的CPU时间片，再次轮到定时器执行，时间已经过期4ms。

#### process.nextTick() ####
用于立即执行某个函数，相比较setTimeout(function(){},0);process.nextTick()方法的操作相对较为轻量级。

	setTimeout(function(){  
		console.log(111);	
	}, 0);

	process.nextTick(function(){
    	console.log(222);    //先输出222,再输出111
	});

#### setImmediate() ####
setImmediate()方法与process.nextTick()方法十分类似，都是将回调函数延迟执行。但两者还有细微的差别。

	process.nextTick(function(){
    	console.log("nextTick延迟执行");
	});
	setImmediate(function(){
    	console.log("setImmediate延迟执行");
	});	
	console.log("正常执行");
	//输出结果：
	//正常执行
	//nextTick延迟执行
	//setImmediate延迟执行

在具体的实现上，process.nextTick()中的回调函数保存在一个数组中，setImmediate()的结果则是保存在链表中。在行为上，process.nextTick()在每轮循环中会将数组中的回调函数全部执行完，而setImmediate()在每轮循环中执行链表中的一个回调函数。

## 事件驱动与高性能服务器 ##

事件驱动的实质，是通过主循环+事件触发的方式来运行程序。
除了上面说的文件操作，对于网络套接字的处理，Node也应用到了异步I/O，网络套接字上侦听到的请求都会形成事件交给I/O观察者。事件循环会不停地处理这些网络I/O事件。如果JavaScript有传入回调函数，这些事件将会最终传递到业务逻辑层进行处理。利用Node构建Web服务器，正式在这样的一个基础上实现的，其流程如下图：

![](https://mmbiz.qpic.cn/mmbiz_png/Zm7gE3cT57ObiaMia98qer0BwTickGj3ibpNtChOqbhbZXAiao7E5UJea5bMyx6bbGtFUCVEdkic9iarRXVuAIMeAWXEQ/0?wx_fmt=png)

