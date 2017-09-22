const circle = require("./circle.js");
console.log(`半径为4的圆的面积是${circle.area(4)}`);

/*访问主模块
* 通过require.main === module来判断一个文件是否被直接运行
* */
console.log(require.main === module);
console.log(module);