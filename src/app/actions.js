import { constant } from 'lodash/fp'
import { delay } from '../util'
import { command } from '../effective/command'

export const INC = 'inc'
export const inc = () => ({ type: INC })

export const ASYNC_INC = 'async-inc'
export const asyncInc = () => ({ type: ASYNC_INC })

export const SET_COUNT = 'set-count'
export const setCount = count => ({ type: SET_COUNT, count })

export const delayedInc = command(async count => {
  await delay(1000)
  return setCount(count + 1)
})

export const SET_COLOR = 'set-color'
export const setColor = color => ({ type: SET_COLOR, color })

export const LOAD = 'load'
export const load = () => ({ type: LOAD })

export const UNLOAD = 'unload'
export const unload = () => ({ type: UNLOAD })

export const INIT_STATE = 'init-state'
export const initState = state => ({ type: INIT_STATE, state })

export const DO_MULTIPLE_THINGS = 'do-multiple-things'
export const doMultipleThings = () => ({ type: DO_MULTIPLE_THINGS })

export const WAIT_IS_OVER = 'wait-is-over'
export const waitIsOver = ({ type: WAIT_IS_OVER })

export const waitASecond = command(action => delay(1000).then(constant(action)))
export const doOneThing = command(() => delay(1000).then(inc))
export const doOtherThing = command(() => delay(2000).then(inc))
