import { forEach, concat, without, isUndefined, mapValues, toPairs, fromPairs, map, flow, spread, get, deffaultTo } from 'lodash/fp'
import { invoke } from './invoke'

export const fragmentStore = (key, store) => {
  let subscribers = []

  const subscribe = subscriber => {
    subscribers = concat(subscribers, subscriber)
    return () => {
      subscribers = without(subscribers, [subscriber])
    }
  }

  const notifySubscribers = () => forEach(invoke(), subscribers)
  
  const dispatch = action => {
    store.dispatch(action)
    notifySubscribers()
  }

  const getState = () => store.getState()[key]

  return {
    ...store,
    subscribe,
    dispatch,
    getState
  }
}

export const combineFragmentReducers = reducers => 
  (state, action) => {
    if(action.type === '@@redux/INIT'){
      return flow(
        toPairs,
        map(([fragmentId, fragmentReducer]) => [fragmentId, fragmentReducer(get(action.fragmentId, state), action)]),
        fromPairs
      )(reducers) 
    } 
    else {
      return { 
        ...state, 
        [action.fragmentId]: reducers[action.fragmentId](state[action.fragmentId], action) 
      }
    }
  }

export const replaceFragmentReducers = (reducers, store) => {
  store.replaceReducer(combineFragmentReducers(reducers))
}