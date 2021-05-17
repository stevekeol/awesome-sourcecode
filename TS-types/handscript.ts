/**
 * 泛型的高级特性：支持嵌套
 */
type CutTail<Tuple extends any[]> = Reverse<CutHead<Reverse<Tuple>>>;

/**
 * 泛型的高级特性：支持递归
 */
// (递归声明)单链表
type ListNode<T> = {
  data: T,
  next: ListNode<T> | null;
}

// (递归调用)将类型中所有属性变为可选
type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: T[P] }
  : T;

type PartialedWindow = DeepPartial<Window>; //此时window上面所有属性(浅/深)均变为可选

/*---------------------------------------------------------------*/

/**
 * 编写一个TS泛型工具Transfer<Fn>,将Fn参数表最后一个参数切掉,并返回切掉参数之后的函数类型
 * @notice 实际项目中不建议这样做，但作为思考，值得写写
 */

/**
 * 使用三元运算符+infer来萃取 `函数的参数表元组类型`
 * @notice `ArgumentType<F>`旨在取出F中的参数构成的类型
 * @notice `infer U`表示待推断的函数参数, 若F能赋值给`(...args: infer U) => any` 则结果是其中的U，否则为never
 */
type ArgumentType<F> = F extends (...args: infer P) => any ? P : never;

/**
 * 利用函数参数表操作元组(因为新元组类型不好构建)
 */
type CutHead<Tuple extends any[]> = ((...args: Tuple) => any) extends (first: any, ...rest: infer Result) => any ? Result : never;

type Transfer<F extends (...args: any[]) => any> = (...args: Cutail<ArgumentType<F>>) => ReturnType<F>;


/*---------------------------------------------------------------*/

/**
 * TS递归停止的写法
 */


type Prepend<Tuple extends any[], Addend> = ((_0: Addend, ..._1: Tuple) => any) extends ((..._: infer Result) => any) ? Result : never;

type Reverse<Tuple extends any[], Prefix extends any[] = []> = {
  stop: Prefix
  continue: ((..._: Tuple) => any) extends ((_0: infer First, ..._1: infer Next) => any)
      ? Reverse<Next, Prepend<Prefix, First>>
      : never
}[Tuple extends [any, ...any[]] ? 'continue' : 'stop'];

/*---------------------------------------------------------------*/

/**
 * Typescript最新的对Tuple的支持;
 * @Unshift 增加元组首部
 * @Shift 移除元组首部
 * @Push 增加元组尾部
 * @Pop 移除元组尾部
 */

type Unshift<Tuple extends any[], Added> = [Added, ...Tuple];

type Shift<Tuple extends any[]> = Tuple extends [first: any, ...args: infer R] ? R : never;

type Push<Tuple extends any[], Added> = [...Tuple, Added];

type Pop<Tuple extends any[]> = Tuple extends [...args: infer R, last: any] ? R : never;

/*---------------------------------------------------------------*/

/**
 * Typescript 示例: 泛型在自定义类装饰器中的使用(构建实例时自动加入某些参数)
 */

/** raw */
function classDecorator_raw<T>(construtor: T) {
  /** 此处的匿名类会语法提示: T不是构造函数类型 */
  return class extends construtor {
    author: "stevekeol";
    email: "stevekeol.x@gmail.com";
  }
}

/** mature */
function classDecorator<T extends new (...args: any[])=> {}>(construtor: T) {
  return class extends construtor {
    author: "stevekeol";
    email: "stevekeol.x@gmail.com"    
  }
}

/** use */
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
t.print();




