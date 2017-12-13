import { has, get, curry } from 'lodash/fp'

export const fragmentIdKey = 'fragmentId'

export const isAction = has('type')

export const isBound = has(fragmentIdKey)

export const getActionFragmentId = get(fragmentIdKey) 

export const isBoundTo = (fragmentId, action) => getActionFragmentId(action) === fragmentId

export const bindAction = curry(
  (fragmentId, action) => !isAction(action) || isBound(action) ? action : { ...action, [fragmentIdKey]: fragmentId }
)