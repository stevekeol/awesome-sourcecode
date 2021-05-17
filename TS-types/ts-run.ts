/** use 
 tsc --target ES5 --experimentalDecorators .\classDecorator.ts
*/
function classDecorator<T extends new (...args: any[]) => {}>(construtor: T) {
  return class extends construtor {
    author: "stevekeol";
    email: "stevekeol.x@gmail.com"    
  }
}

@classDecorator
class Test {
  constructor(public name: string) {}
  getName() {
    return this.name;
  }

  print() {
    console.log(this);
  }
}

let t = new Test("zhangjie");
console.log(t);

/**
 * Map, Array, Set, json 的相互转化
 */
let m = new Map().set("name", "jiege").set("age", 28);
let a = ["red", "green"];
let s = new Set().add("school").add("color");

/** Map 和 Array 的转化 */
let map2array = [...m]; //展开操作符(即隐式迭代)，再数组化
let map2array2 = Array.from(m); //直接数组化(Array.from内部会迭代访问键值对)
console.log(map2array2)

let array2map = new Map(map2array); // 可以利用二维数组直接构造

/** Map 和 json 的转化 */

let set1 = new Set().add('123-123').add('234-234').add('546-456');
let res = JSON.stringify({
  timestamp: '202-12-21 21:30',
  event: 2,
  data: Array.from(set1)
})
console.log(res);

let arr = ["123-123","234-234","546-456"];
let s1 = new Set(arr)
console.table(arr)

// Map参数的传递验证
let map = new Map().set("name", "jie").set("age", 28);
let diffMap = new Map().set("car", "bmw");

function changeMap(map, diffMap) {
  for(let key of diffMap.keys()) {
    map.set(key, diffMap.get(key));
  }
}

changeMap(map, diffMap);
console.log(map);

/**
 * PerformanceMonitor
 * 函数性能检测器(待完成)
 */
function performanceDecorator(fn: Function) {
  let startTime = performance.now();
  fn();
  let endTime = performance.now();

  return (endTime - startTime);
}