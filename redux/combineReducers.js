/**
 * combineReducers.ts
 * @Desc 将多个子孙reducers组合成全局唯一的一个reducers
 *
 * @Param
 * 1. 一级参数是 reducers
 * 2. 二级参数是 preState, action
 * 
 * @Return
 * 经过action之后的state
 *
 * @Procedure
 * 1. 将reducers对象中type为function的subreducer筛选出来赋值给finlReducer对象
 * 2. 返回接受state和action的函数
 * 3. 该函数针对每一个reducer均处理该action
 */
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};
  for(let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if(typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);
  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState = {};
    for(let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];

      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  }
}


/**
 * How to use
 */
// reducers/todos.js
export default function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}
// reducers/counter.js
export default function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}
// reducers/index.js
import { combineReducers } from 'redux'
import todos from './todos'
import counter from './counter'
export default combineReducers({
  todos,
  counter
})
