import { isUndefined } from 'lodash/fp'
import { effect } from '../effective'
import { setItemToLocalStorage, getItemFromLocalStorage } from '../effective/commands'
import { noAction } from '../util'
import { batch } from '../effective/command'
import { stringToInt } from '../util/stringConversion'
import { 
  INC, ASYNC_INC, SET_COUNT, delayedInc, SET_COLOR, LOAD, UNLOAD, INIT_STATE, INCREASE_TWICE, WAIT_IS_OVER, 
  initState, waitIsOver, waitASecond, firstIncrease, secondIncrease
} from './actions'

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
      return { ...state, count: stringToInt(action.count) }
    case SET_COLOR:
      return { ...state, color: action.color}
    case LOAD: 
      return effect(state, getItemFromLocalStorage(initState, 'app-state'))
    case INIT_STATE: 
      return isUndefined(action.state) ? state : action.state
    case UNLOAD:
      return effect(state, setItemToLocalStorage(noAction, 'app-state', state))
    case INCREASE_TWICE:
      return effect(state, waitASecond(waitIsOver))
    case WAIT_IS_OVER:
      return effect(state, batch(firstIncrease(), secondIncrease()))
    default:
      return state
  }
}
