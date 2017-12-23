import { forEach, concat, without, toPairs, fromPairs, map, flow, get, isUndefined } from 'lodash/fp'
import { invoke } from '../util/invoke'
import { bindAction } from '../util/bindAction'
import { mapPromise } from '../util/mapPromise'
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

  const dispatch = flow(
    bindAction(fragmentId),
    store.dispatch
  )

  return {
    dispatch,
    subscribe,
    getState
  }
}

const isInitAction = action => action.type === '@@redux/INIT' || action.type === '@@INIT'

export const combineFragmentReducers = (reducers, services) => (state, action) => {

  const dispatch = action => {
    if(action.type !== ''){
      const dispatchFragment = get([action.fragmentId, 'dispatch'], reducers)
      dispatchFragment(action)
    }
  }

  const executeCommands = fragmentId => forEach(
    flow(
      execute(services),
      mapPromise(flow(bindAction(fragmentId), dispatch))
    )
  )
  
  let newState

  if(isInitAction(action)) {
    newState = flow(
      toPairs,
      map(([fragmentId, { reducer, getProps }]) => { 
        const fragmentState = get(fragmentId, state)
        const reduced = reducer(fragmentState, bindAction(fragmentId, action), getProps())
        const effect = liftEffect(reduced)
        executeCommands(fragmentId)(effect.commands)

        return [fragmentId, effect.state]
      }), 
      fromPairs
    )(reducers) 
  }
  else {
    const fragmentState = get(action.fragmentId, state)
    if(isUndefined(fragmentState)){
      newState = state
    }
    else {
      const effect = liftEffect(
        reducers[action.fragmentId].reducer(get(action.fragmentId, state), action, reducers[action.fragmentId].getProps())
      )
  
      executeCommands(action.fragmentId)(effect.commands)
    
      newState = { 
        ...state, 
        [action.fragmentId]: effect.state
      }
    }
  }

  return { ...newState, lastActionFragmentId: action.fragmentId }
}