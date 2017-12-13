import { forEach, concat, without, isUndefined, mapValues, toPairs, fromPairs, map, flow, spread, get, deffaultTo } from 'lodash/fp'
import { invoke } from './invoke'

export const fragmentStore = (fragmentId, store) => {
  let subscribers = []

  const subscribe = subscriber => {
    subscribers = concat(subscribers, [subscriber])
    return () => {
      subscribers = without(subscribers, [subscriber])
    }
  }

  const getState = () => store.getState()[fragmentId]
  
  store.subscribe(() => {
    const currentState = store.getState()[fragmentId]
      if(store.getState().lastActionFragmentId === fragmentId){
        forEach(invoke(), subscribers)
      }
  })

  return {
    ...store,
    subscribe,
    getState
  }
}

export const combineFragmentReducers = reducers => 
  (state, action) => {
    const newState = action.type === '@@redux/INIT'
      ? flow(
          toPairs,
          map(([fragmentId, fragmentReducer]) => [fragmentId, fragmentReducer(get(action.fragmentId, state), action)]),
          fromPairs
        )(reducers) 
      : { 
        ...state, 
        [action.fragmentId]: reducers[action.fragmentId](state[action.fragmentId], action) 
      }

      return { ...newState, lastActionFragmentId: action.fragmentId }
  }


export const replaceFragmentReducers = (reducers, store) => {
  store.replaceReducer(combineFragmentReducers(reducers))
}