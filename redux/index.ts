/**
 * index.ts
 * 导出types和关键函数
 */

import createStore from './createStore';
import applyMiddleware from './applyMiddleware';
import compose from './compose';
import combineReducers from './combineReducers';
import bindActionCreators from './bindActionCreators';

export { 
  // ... 
} from './types/...';

export {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose
}