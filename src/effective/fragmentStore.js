import { forEach, concat, without, toPairs, fromPairs, map, flow, get, isUndefined } from 'lodash/fp'
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

  const dispatchFragment = get([action.fragmentId, 'dispatch'], reducers)
  const dispatch = action => {
    if(action.type !== '')
      dispatchFragment(action)
  }

  const executeCommands = forEach(
    flow(
      execute(services),
      mapPromise(dispatch)
    )
  )
  
  let newState

  if(action.type === '@@redux/INIT' || action.type === '@@INIT') {
    newState = flow(
      toPairs,
      map(([fragmentId, { reducer, getProps }]) => { 
        const fragmentState = get(fragmentId, state)
        const reduced = reducer(fragmentState, action, getProps())
        const effect = liftEffect(reduced)
        executeCommands(effect.commands)

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
  
      executeCommands(effect.commands)
    
      newState = { 
        ...state, 
        [action.fragmentId]: effect.state
      }
    }
  }

  // console.log('state after', newState)

  return { ...newState, lastActionFragmentId: action.fragmentId }
}