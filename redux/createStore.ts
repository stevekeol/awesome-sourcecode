/**
 * createStore.ts
 * @Desc Creates a Redux store that holds the state tree.
 *
 * @Note
 * 1. 改变store中数据唯一的方式是调用dispatch()
 * 2. 整个app应该只有唯一的store
 * 3. 可以使用combineReducers()将多个reducers组合成一个
 *
 * @Param
 * 1. reducer: 传入action和current state，返回 next state的函数
 * 2. preloadedState: The initial state
 * 3. enhancer: 使用第三方插件(middleware, time travel, persistence等)，增强store功能。
 *              Redux唯一附带的enhancer是appliMiddleware()
 *
 * @Return
 * 返回一个 Redux store: read the state, dispatch actions and subscribe to changes
 *
 * @Memo
 * 1. js梳理逻辑
 * 2. ts完整代码
 *
 * @Procedure
 * 1. 参数校验
 * 2. 前置参数备份?
 * 3. 核心函数定义
 * 4. 暴露核心函数
 */

export default function createStore(reducer, preloadedState, enhancer) {
  if(typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if(typeof enhancer !== 'undefined') {
    if(typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    return enhancer(createStore)(reducer, preloadedState);
  }

  if(typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  /**
   * @Desc 返回store管理的current state
   */
  function getState() {
    if(isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing.');
    }
    return currentState;
  }

  /**
   * @Desc 添加一个change listener
   *
   * @Param 
   * listener: 每一个dispatch都会调用的callback
   * 
   * @Return 
   * 返回一个移除该change listner的函数
   * 
   * @Note
   * 1. 当dispatch action时就会被调用
   * 2. 届时state tree将变动
   * 3. 在回调中你可以调用getState()读取最新的current state
   *
   * @Note
   * 
   * 
   */
  function subscribe(listener) {
    if(typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }
    if(isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing.');
    }
    let isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if(!isSubscribed) return;
      if(isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing.')
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    }
  }

  /**
   * @Desc Dispatch an action
   * 
   * @Param 
   * action: 表明what changed的object对象,该对象必须有type属性
   *
   * @Return
   * 返回传入的action，以便后续使用.(当用了custom middleware，则返回的是别的)
   *
   * @Note
   * 1. reducer(current state, action)函数用来创建store,返回新的state tree
   * 2. dispatch(action)的基本实现仅支持plain object actions.
   *    如果dispatch一个Promise, Observable, thunk等则需要用对应的middleware包裹createStore.
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. Use custom middleware for async actions.');
    }

    if(typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ');
    }
    if(isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    const listeners = (currentListeners = nextListeners);
    for(let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }

    return action;
  }


  /*-----------helper------------*/

  /**
   * @Desc 浅拷贝currentListeners，防止在dispatch过程中调用subscribe/unsubscribe出现bug
   */
  function ensureCanMutateNextListeners() {
    if(nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * @Desc 检测obj是否为plain object
   */
  function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false

    let proto = obj
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
  }  

  const store = {
    dispatch,
    subscribe,
    getState
  }

  return store;
}