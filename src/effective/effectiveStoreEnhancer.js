import { curry, map, reduce, toPairs, isEmpty, compose } from 'lodash/fp'
import { Fragment } from './fragment';
import { lift, liftArrow } from '../util/lift'
import { flip } from '../util/flip'

const Effect = Symbol('Effect')

const makeEffect = curry((state, actions) => ({
  [Effect]: true,
  state, 
  actions
}))

const noEffect = makeEffect({}, [])

const isEffect = value => value[Effect]

const liftEffect = lift(isEffect, flip(makeEffect)([]))

const apply = value => f => f(value)

export const effect = (state, asyncAction) => makeEffect(state, [asyncAction])

export const effectiveStoreEnhancer = (parentStore, fragmentId) => nextStoreCreator => (reducer, preloadedState) => {

  const effectReducer = reducer => (state, action) => {
    const effect = liftEffect(reducer(state, action))
    
     if(!isEmpty(store)) { 
      Promise.all(map(compose(applyGetState, liftArrow), effect.actions))
         .then(map(dispatch))
     }
  
     return effect.state
  } 
  
  const dispatch = actionOrActionCreator => {
    const action = liftArrow(actionOrActionCreator)()
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
  const applyGetState = apply(store.getState)
  
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