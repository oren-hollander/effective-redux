import { shape, string } from 'prop-types'
import { curry, fromPairs, map, isEmpty } from 'lodash/fp'
import { isTagged, tagAction, getActionTag } from '../util/tagAction'

const mapWithIndex = map.convert({cap: false})

export const actionPropType = shape({
  type: string
})

export const defineAction = (type, ...paramNames) => isEmpty(paramNames) ? { type } : { type, paramNames } 

export const createAction = curry((actionDefinition, ...params) => {
  const action = {
    type: actionDefinition.type, 
    ...fromPairs(mapWithIndex((paramName, index) => [paramName, params[index]], actionDefinition.paramNames))
  }

  if(isTagged(actionDefinition)){
    return tagAction(getActionTag(actionDefinition), action)
  }
  else {
    return action    
  }
})