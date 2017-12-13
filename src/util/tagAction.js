import { curry, isObject, has, get, isFunction } from 'lodash/fp'
import { Fragment } from '../effective/fragment'

export const isAction = action => isObject(action) && has('type', action)

export const isTagged = action => action.hasOwnProperty(Fragment)

export const getActionTag = action => get(Fragment, action) 

export const isTaggedWith = (fragmentId, action) => getActionTag(action) === fragmentId

export const tagAction = (fragmentId, action) => !isAction(action) || isTagged(action) ? action : {...action, [Fragment]: fragmentId}

export const tagActionCreator = (fragmentId, actionCreator) => {
  if(!isFunction(actionCreator) || isTagged(actionCreator)){
    return actionCreator
  }

  const taggedActionCreator = (...args) => {
    return tagAction(fragmentId, actionCreator(...args))
  }

  taggedActionCreator[Fragment] = fragmentId
  return taggedActionCreator
}

export const tag = curry (
  (fragmentId, actionOrActionCreater) => isFunction(actionOrActionCreater) 
    ? tagActionCreator(fragmentId, actionOrActionCreater) 
    : tagAction(fragmentId, actionOrActionCreater)
)