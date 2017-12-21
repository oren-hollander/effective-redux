import { constant } from 'lodash/fp'
import { delay } from '../util/delay'
import { command } from '../effective/command'
import { createAction, defineAction } from '../util/actionDefinition'

export const INC = 'inc'
export const inc = { type: INC }

export const ASYNC_INC = 'async-inc'
export const asyncInc = { type: ASYNC_INC }

export const SET_COUNT = 'set-count'
export const setCount = defineAction(SET_COUNT, 'count')

export const delayedInc = command(async count => {
  await delay(1000)
  return createAction(setCount, count + 1)
})

export const SET_COLOR = 'set-color'
export const setColor = defineAction(SET_COLOR, 'color')

export const LOAD = 'load'
export const load = defineAction(LOAD)

export const UNLOAD = 'unload'
export const unload = defineAction(UNLOAD)

export const INIT_STATE = 'init-state'
export const initState = defineAction(INIT_STATE, 'state')

export const INCREASE_TWICE = 'increase-twice'
export const increaseTwice = defineAction(INCREASE_TWICE)

export const WAIT_IS_OVER = 'wait-is-over'
export const waitIsOver = defineAction(WAIT_IS_OVER)

export const waitASecondImpl = delay => command(action => delay(1000).then(constant(action)))
export const waitASecond = waitASecondImpl(delay)

export const firstIncrease = command(() => delay(1000).then(constant(inc)))
export const secondIncrease = command(() => delay(2000).then(constant(inc)))