import { INC, ASYNC_INC, SET_COUNT, delayedInc, SET_COLOR } from './actions'
import { effect } from '../effective/effectiveStoreEnhancer'

const initialState = {
  count: 0,
  color: 'lightgrey'
}

export const reducer = (state = initialState, action) => {
  switch(action.type){
    case INC:
      return { ...state, count: state.count + 1 }
    case ASYNC_INC: 
      return effect(state, delayedInc)
    case SET_COUNT:
      return { ...state, count: action.count }
    case SET_COLOR:
      return { ...state, color: action.color}

    default:
      return state
  }
}
