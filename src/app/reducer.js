import { isUndefined } from 'lodash/fp'

import { 
  INC, ASYNC_INC, SET_COUNT, delayedInc, SET_COLOR, LOAD, UNLOAD, INIT_STATE, DO_MULTIPLE_THINGS, WAIT_IS_OVER, 
  initState, waitIsOver, waitASecond, doOneThing, doOtherThing
} from './actions'

import { effect } from '../effective'
import { setItemToLocalStorage, getItemFromLocalStorage } from '../effective/commands'
import { noAction } from '../util'
import { batch } from '../effective/command'

const initialState = {
  count: 0,
  color: 'lightgrey'
}

export const reducer = (state = initialState, action) => {
  switch(action.type){
    case INC:
      return { ...state, count: state.count + 1 }
    case ASYNC_INC: 
      return effect(state, delayedInc(state.count))
    case SET_COUNT:
      return { ...state, count: action.count }
    case SET_COLOR:
      return { ...state, color: action.color}
    case LOAD: 
      return effect(state, getItemFromLocalStorage(initState, 'app-state'))
    case INIT_STATE: 
      return isUndefined(action.state) ? state : action.state
    case UNLOAD:
      return effect(state, setItemToLocalStorage(noAction, 'app-state', state))
    case DO_MULTIPLE_THINGS:
      return effect(state, waitASecond(waitIsOver))
    case WAIT_IS_OVER:
      return effect(state, batch(doOneThing(), doOtherThing()))
    default:
      return state
  }
}
