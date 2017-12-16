import { forEach, concat, without, toPairs, fromPairs, map, flow, get } from 'lodash/fp'
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

export const combineFragmentReducers = (reducers, services) => (state, action) => {

  const dispatch = get([action.fragmentId, 'dispatch'], reducers)

  const executeCommands = forEach(
    flow(
      execute(services),
      mapPromise(dispatch)
    )
  )
  
  let newState

  if(action.type === '@@redux/INIT') {
    newState = flow(
      toPairs,
      map(([fragmentId, { reducer, getProps }]) => { 
        const effect = liftEffect(reducer(get(fragmentId, state), action, getProps()))
        executeCommands(effect.commands)

        return [fragmentId, effect.state]
      }), 
      fromPairs
    )(reducers) 
  }
  else {
    const effect = liftEffect(
      reducers[action.fragmentId].reducer(get(action.fragmentId, state), action, reducers[action.fragmentId].getProps())
    )

    executeCommands(effect.commands)
  
    newState = { 
      ...state, 
      [action.fragmentId]: effect.state
    }
  }

  return { ...newState, lastActionFragmentId: action.fragmentId }
}