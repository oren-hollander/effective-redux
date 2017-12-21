import { curry,  reduce, toPairs, get } from 'lodash/fp'
import { flip } from '../util/flip'
import { lift, liftArray } from '../util/lift'

const Effect = Symbol('Effect')

const makeEffect = curry((state, commands) => ({
  [Effect]: true,
  state, 
  commands
}))

const noEffect = makeEffect({}, [])

const isEffect = value => get(Effect, value)

export const liftEffect = lift(isEffect, flip(makeEffect)([]))

export const effect = (state, commands) => makeEffect(state, liftArray(commands))

export const combineReducers = reducers => (state, action) => 
  reduce((effects, [key, reducer]) => {
    const effect = liftEffect(reducer(state && state[key], action))
    return makeEffect({...effects.state, [key]: effect.state}, [...effects.actions, ...effect.actions])
  }, noEffect, toPairs(reducers)) 