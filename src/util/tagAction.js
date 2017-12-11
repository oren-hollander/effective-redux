import { isObject, has, get, isFunction } from 'lodash/fp'
import { Fragment } from '../effective/fragment'

export const isAction = action => isObject(action) && has('type', action)

export const isTagged = action => has(Fragment, action)

export const isTaggedWith = (fragmentId, action) => get(Fragment, action) === fragmentId

export const tagAction = (fragmentId, action) => isTagged(action) ? action : {...action, [Fragment]: fragmentId}

export const tagActionCreator = (fragmentId, actionCreator) => {
  if(isTagged(actionCreator)){
    return actionCreator
  }

  const taggedActionCreator = (...args) => tagAction(fragmentId, actionCreator(...args))
  taggedActionCreator[Fragment] = fragmentId
  return taggedActionCreator
}

export const tag = (fragmentId, actionOrActionCreater) => isFunction(actionOrActionCreater) 
  ? tagActionCreator(fragmentId, actionOrActionCreater) 
  : tagAction(fragmentId, actionOrActionCreater)