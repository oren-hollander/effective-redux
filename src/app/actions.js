import { delay as _delay } from 'lodash/fp'
import { selectCount } from './selectors'

const delay = millis => new Promise(_delay(millis))

export const INC = 'inc'
export const inc = () => ({ type: INC })

export const ASYNC_INC = 'async-inc'
export const asyncInc = () => ({ type: ASYNC_INC })

export const SET_COUNT = 'set-count'
export const setCount = count => ({ type: SET_COUNT, count })

export const delayedInc = async getState => {
  const count = selectCount(getState())
  await delay(1000)
  return setCount(count + 1)
}

export const SET_COLOR = 'set-color'
export const setColor = color => ({ type: SET_COLOR, color })

export const LOAD = 'load'
export const load = () => ({ type: LOAD })

export const UNLOAD = 'unload'
export const unload = () => ({ type: UNLOAD })

export const INIT_STATE = 'init-state'
export const initState = state => ({ type: INIT_STATE, state })