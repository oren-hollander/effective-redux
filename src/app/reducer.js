import { INC, ASYNC_INC, SET_COUNT, delayedInc, SET_COLOR, LOAD, UNLOAD, INIT_STATE, initState, DO_MULTIPLE_THINGS, inc, WAIT_IS_OVER, waitIsOver } from './actions'
import { effect } from '../effective/effectiveStoreEnhancer'
import { setItemToLocalStorage, getItemFromLocalStorage } from '../effective/commands/localStorageCommand'
import { isUndefined } from 'lodash/fp'
import { delay } from '../util/delay'
import { batch } from '../effective/commands/batch'
import { noAction } from '../util/noAction'

const initialState = {
  count: 0,
  color: 'lightgrey'
}

const waitASecond = action => () => delay(1000).then(() => action)
const doOneThing = () => delay(1000).then(inc)
const doOtherThing = () => delay(2000).then(inc)

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
      return effect(state, setItemToLocalStorage(noAction, 'app-state', state))
    case DO_MULTIPLE_THINGS:
      return effect(state, waitASecond(waitIsOver))
    case WAIT_IS_OVER:
      return effect(state, batch(doOneThing(), doOtherThing()))
    default:
      return state
  }
}
