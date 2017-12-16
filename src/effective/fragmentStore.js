import { forEach, concat, without, toPairs, fromPairs, map, flow, get, compose } from 'lodash/fp'
import { invoke } from '../util/invoke'
import { bindAction } from '../util/bindAction'
import { mapPromise } from '../util'
import { execute } from './command'
import { liftEffect } from './effect'

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
    if(store.getState().lastActionFragmentId === fragmentId){
      forEach(invoke(), subscribers)
    }
  })

  const dispatch = action => {
    const boundAction = bindAction(fragmentId, action)
    return store.dispatch(boundAction)
  }

  return {
    ...store,
    dispatch,
    subscribe,
    getState
  }
}

export const combineFragmentReducers = reducers => (state, action) => {

  let newState
  if(action.type === '@@redux/INIT') {
    newState = flow(
      toPairs,
      map(([fragmentId, x]) => { 
        const { reducer, getProps } = x
        return [fragmentId, reducer(get(fragmentId, state), action, getProps())]
      }),
      fromPairs
    )(reducers) 
  }
  else {
    const reducerResult = reducers[action.fragmentId].reducer(state[action.fragmentId], action, reducers[action.fragmentId].getProps()) 
    const effect = liftEffect(reducerResult)
    forEach(compose(mapPromise(reducers[action.fragmentId].dispatch), execute), effect.commands)
  
    newState = { 
      ...state, 
      [action.fragmentId]: effect.state
    }
  }

  return { ...newState, lastActionFragmentId: action.fragmentId }
}