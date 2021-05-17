/**
 * 内置泛型工具的实现
 * @createTime 2021-05-05 15:45
 * @notice TS泛型类型的定义已经很骚了，要实现对应的泛型功能，很需要水平(定义泛型类型)
 * @reference https://www.typescriptlang.org/docs/handbook/utility-types.html
 * @TODO 多参悟内置泛型工具的实现，快速提升水平(实现泛型工具)
 * 
 * Partial<T>: 使T中属性均可选
 * Required<T>: 使T中属性均必需
 * Readonly<T>: 使T中属性均只读
 * Record<K,T>: 使Map中，键为K类型，值为T类型
 * Pick<T,K>: 从T类型中挑选出K类型(某个/些键构建成的类型)并构建成新类型
 * Exclude<T,U>: 从T类型中移除掉U类型(注:T是联合类型)
 * Omit<T,K>: 从T类型中移除掉K类型(某个/些键构建成的类型)并构建成新类型
 * Extract<T,U>: 从T类型中挑选出U类型(注:T是联合类型)
 * NonNullable<T>: 从T类型中移除null和undefined
 * Parameters<T>: T是一个函数的类型，取出该函数的参数构成的元组类型
 * ConstructorParameters<T>: T是一个构造函数的类型，取出该函数的参数构成的元组类型
 * ReturnType<T>: T是一个函数的类型，取出该函数的返回值的类型
 * InstanceType<T>: T是一个构造函数，取出T的实例的类型
 * ThisParameterType<T>: T是一个函数的类型，取出该函数中this参数的类型
 * OmitThisParameter<T>: T是一个函数的类型，移除该this参数之后剩下的类型
 * ThisType<T>: 暂不使用
 */

/**
 * Partial<T>: 使T中属性均可选
 * @implement
 * @use
 */
type _Partial<T> = {
  [P in keyof T]?: T[P];
}

/**
 * Required<T>: 使T中属性均必需
 * @implement
 * @use
 */
type _Required<T> = {
  [P in keyof T]-?: T[P];
}

/**
 * Readonly<T>: 使T中属性均只读
 * @implement
 * @use
 */
type _Readonly<T> = {
  readonly [P in keyof T]: T[P];
}

/**
 * Record<K,T>: 使Map中，键为K类型，值为T类型
 * @implement
 * @use
 * @notice K => K extends keyof any ?
 */
type _Record<K extends keyof any, T> = {
  [P in K]: T;
}

/**
 * Pick<T,K>: 从T类型中挑选出K类型(某个/些键构建成的类型)并构建成新类型
 * @implement
 * @use
 * @notice K => K extends keyof T ?
 */
type _Pick<T, K extends keyof T> = {
  [P in keyof T]: T[P];
}

/**
 * Exclude<T,U>: 从T类型中移除掉U类型(注:T是联合类型)
 * @implement
 * @use
 * @notice T extends U ? never : T  ?
 */
type _Exclude<T, U> = T extends U ? never : T;

/**
 * Omit<T,K>: 从T类型中移除掉K类型(某个/些键构建成的类型)并构建成新类型
 * @implement
 * @use
 * @notice
 */
type _Omit<T, K extends keyof any> = _Pick<T, Exclude<keyof T, K>>;

/**
 * Extract<T,U>: 从T类型中挑选出U类型(注:T是联合类型)
 * @implement
 * @use
 * @notice 
 */
type _Extract<T, U> = T extends U ? T : never;

/**
 * NonNullable<T>: 从T类型中移除null和undefined
 * @implement
 * @use
 * @notice 
 */
type _NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Parameters<T>: T是一个函数的类型，取出该函数的参数构成的元组类型
 * @implement
 * @use
 * @notice `new (...args: infer P) => any ? P : never` 好好解析一下
 */
type _Parameters<T extends (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

/**
 * ConstructorParameters<T>: T是一个构造函数的类型，取出该函数的参数构成的元组类型
 * @implement
 * @use
 * @notice
 */
type _ConstructorParameters<T extends (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

/**
 * ReturnType<T>: T是一个函数类型，取出该函数类型的返回值类型
 * @implement
 * @use
 * @notice
 */
type _ReturnType<T extends (...args: any) => any> = T extends (...args: any) => (infer R) ? R : any;

/**
 * InstanceType<T>: T是一个构造函数类型，取出该构造函数类型的实例类型
 * @implement
 * @use
 * @notice
 */
type _InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;

/**
 * ThisParameterType<T>: 提取出函数类型中`this`参数的类型(没有this的话，返回unknown)
 * @implement
 * @use
 * @notice
 */
type _ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U: unknown;

/**
 * OmitThisParameter<T>: T是一个函数的类型，移除该函数this参数之后剩下的类型
 * @implement
 * @use
 * @notice
 */
type _OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;