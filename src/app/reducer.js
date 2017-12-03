import { INC, ASYNC_INC, SET_COUNT, delayedInc, SET_COLOR, LOAD, UNLOAD, INIT_STATE, initState } from './actions'
import { effect } from '../effective/effectiveStoreEnhancer'
import { setItemToLocalStorage, getItemFromLocalStorage } from '../effective/effects/localStorageEffect'
import { isUndefined } from 'lodash/fp'

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
    case LOAD: 
      return effect(state, getItemFromLocalStorage(initState, 'app-state'))
    case INIT_STATE: 
      return isUndefined(action.state) ? state : action.state
    case UNLOAD:
      return effect(state, setItemToLocalStorage(() => ({type: 'noop'}), 'app-state', state))
    default:
      return state
  }
}
