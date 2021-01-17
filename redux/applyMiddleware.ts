import compose from './compose';

/**
 * @Desc 创建一个store enhancer: 使用createStore创建store，利用middleware增强store的dispatch().
 *       方便一系列任务: 简洁的表达异步action; Logging每个action payload.
 *
 * @Note
 * 1. applyMiddleware实质上把action->reducer : action->middleware1->middleware2->...->reducer
 * 
 * @Param 一系列中间件
 *
 * @Return 增强了其dispatch()的Store
 */
export default function applyMiddleware(...middlewares) {
  return createStore => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer);
    // let dispatch = () => {
    //   throw new Error('Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.')
    // }
    let dispatch = store.dispatch;
    const middlewareAPI = {
      getState: store.getState,
      dispatch: action => dispatch(action)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}


/**
 * How to Use
 */
applyMiddleware(...middlewares)(createStore)(reducer, preloadedState, enhancer);


/**
 * Middleware 中间件的结构
 */
const Middleware = ({dispatch, action}) => next => action => {
  //do sth
  next(action);
  //do sth
}