import { curry, map, reduce, toPairs, isEmpty, compose, constant } from 'lodash/fp'
import { Fragment } from './fragment';
import { flip, mapPromise, lift, liftArray } from '../util'
import { execute } from './command'

const Effect = Symbol('Effect')

const makeEffect = curry((state, commands) => ({
  [Effect]: true,
  state, 
  commands
}))

const noEffect = makeEffect({}, [])

const isEffect = value => value[Effect]

const liftEffect = lift(isEffect, flip(makeEffect)([]))

export const effect = (state, commands) => makeEffect(state, liftArray(commands))

export const effectiveStoreEnhancer = (parentStore, fragmentId, propsGetter = constant({})) => nextStoreCreator => (reducer, preloadedState) => {

  const effectReducer = reducer => (state, action) => {    
    const effect = liftEffect(reducer(state, action, propsGetter()))
    if(!isEmpty(store)) 
      map(compose(mapPromise(dispatch), execute), effect.commands)
  
     return effect.state
  } 
  
  const dispatch = action => {
    if(parentStore && fragmentId){
      if(action[Fragment] === fragmentId){
        return store.dispatch(action)
      }
      else {
        return parentStore.dispatch(action)
      }
    }
    else {
      return store.dispatch(action)      
    }
  }

  const store = nextStoreCreator(effectReducer(reducer), preloadedState)
  
  return { 
    ...store, 
    dispatch,
    replaceReducer: reducer => store.replaceReducer(effectReducer(reducer)) 
  }
}

export const combineReducers = reducers => (state, action) => 
  reduce((effects, [key, reducer]) => {
    const effect = liftEffect(reducer(state && state[key], action))
    return makeEffect({...effects.state, [key]: effect.state}, [...effects.actions, ...effect.actions])
  }, noEffect, toPairs(reducers)) 