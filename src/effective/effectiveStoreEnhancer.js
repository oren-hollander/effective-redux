import { map, reduce, toPairs, isEmpty, mapValues } from 'lodash/fp'
import { COMPONENT } from './component';

const mapKeysValues = mapValues.convert({cap: false})

const Effect = Symbol('Effect')

const makeEffect = (state, asyncActions) => ({
  [Effect]: true,
  state, 
  asyncActions
})

const noEffect = makeEffect({}, [])

const isEffect = value => value[Effect]

const ensureEffect = value => isEffect(value) ? value : makeEffect(value, [])

const apply = value => f => f(value)

export const effect = (state, asyncAction) => makeEffect(state, [asyncAction])

export const effectiveStoreEnhancer = (parentStore, componentId) => nextStoreCreator => (reducer, preloadedState) => {

  const effectReducer = reducer => (state, action) => {
    const effect = ensureEffect(reducer(state, action))
    
     if(!isEmpty(effect.asyncActions)) { // todo check if needed to test for emptyness
       Promise.all(map(apply(store.getState), effect.asyncActions))
         .then(actions => {
           return map(dispatch, actions)
        })
     }
  
     return effect.state
  } 
  
  const dispatch = action => {
    if(parentStore && componentId){
      if(action[COMPONENT] === componentId){
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
    const effect = ensureEffect(reducer(state && state[key], action))
    return makeEffect({...effects.state, [key]: effect.state}, [...effects.asyncActions, ...effect.asyncActions])
  }, noEffect, toPairs(reducers)) 


export const combineComponentReducers = reducers => (state, action) => {
  switch(action.type){
    case '@@redux/INIT':
      return mapKeysValues((reducer, ciid) => { 
        return reducer(state[ciid], action)
      }, reducers)

    case 'component-action':
      const result = ensureEffect(reducers[action.ciid](state[action.ciid], action.action))
      return makeEffect({ 
        ...state, 
        [action.ciid]: result.state 
      }, result.asyncActions)

    default: 
      return state
  }
}