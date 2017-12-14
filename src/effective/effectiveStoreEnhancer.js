import { curry, forEach, reduce, toPairs, isUndefined, compose, constant } from 'lodash/fp'
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

export const liftEffect = lift(isEffect, flip(makeEffect)([]))

export const effect = (state, commands) => makeEffect(state, liftArray(commands))

export const effectiveStoreEnhancer = (dispatch, propsGetter = constant({})) => nextStoreCreator => (reducer, preloadedState) => {

  const effectReducer = reducer => (state, action) => {    
    const effect = liftEffect(reducer(state, action, propsGetter()))
    if(!isUndefined(store)) 
      forEach(compose(mapPromise(dispatch), execute), effect.commands)
  
     return effect.state
  } 

  const store = nextStoreCreator(effectReducer(reducer), preloadedState)
  dispatch = dispatch || store.dispatch

  return { 
    ...store, 
    replaceReducer: reducer => store.replaceReducer(effectReducer(reducer)) 
  }
}

export const combineReducers = reducers => (state, action) => 
  reduce((effects, [key, reducer]) => {
    const effect = liftEffect(reducer(state && state[key], action))
    return makeEffect({...effects.state, [key]: effect.state}, [...effects.actions, ...effect.actions])
  }, noEffect, toPairs(reducers)) 