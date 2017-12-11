import { delay } from '../util'
import { selectCount } from './selectors'

export const INC = 'inc'
export const inc = () => ({ type: INC })

export const SET_COUNT = 'set-count'
export const setCount = count => ({ type: SET_COUNT, count })

export const SET_COLOR = 'set-color'
export const setColor = color => ({ type: SET_COLOR, color })

export const LOAD = 'load'
export const load = () => ({ type: LOAD })

export const UNLOAD = 'unload'
export const unload = () => ({ type: UNLOAD })

export const INIT_STATE = 'init-state'
export const initState = state => ({ type: INIT_STATE, state })

export const WAIT_IS_OVER = 'wait-is-over'
export const waitIsOver = () => ({ type: WAIT_IS_OVER })

export const delayedInc = () => async (dispatch, getState) => {
  const count = selectCount(getState())
  await delay(1000)
  dispatch(setCount(count + 1))
}

export const doOneThing = async dispatch => {
  await delay(1000)
  dispatch(inc())
}

export const doOtherThing = async dispatch => {
  await delay(2000)
  dispatch(inc())
}

export const doMultipleThings = () => async dispatch => {
  await delay(1000)

  dispatch(doOneThing)
  dispatch(doOtherThing)
}