const {PI} = Math;
/*模块内的本地变量是私有的，通过在特殊的exports对象上指定额外的属性,将变量暴露出去*/
exports.area = (r) => PI * r * r;
exports.circumference = (r) => 2 * PI * r;