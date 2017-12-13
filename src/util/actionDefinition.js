import { shape, string } from 'prop-types'
import { curry, fromPairs, map, isEmpty } from 'lodash/fp'
import { isBound, bindAction, getActionFragmentId } from '../util/bindAction'

const mapWithIndex = map.convert({cap: false})

export const actionPropType = shape({
  type: string.isRequired
})

export const defineAction = (type, ...paramNames) => isEmpty(paramNames) ? { type } : { type, paramNames } 

export const createAction = curry((actionDefinition, ...params) => {
  const action = {
    type: actionDefinition.type, 
    ...fromPairs(mapWithIndex((paramName, index) => [paramName, params[index]], actionDefinition.paramNames))
  }

  if(isBound(actionDefinition)){
    return bindAction(getActionFragmentId(actionDefinition), action)
  }
  else {
    return action    
  }
})