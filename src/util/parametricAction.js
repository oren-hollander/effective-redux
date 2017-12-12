import { shape, string, object } from 'prop-types'
import { reduce, mapValues, isObject, has, get } from 'lodash/fp'

export const actionPropType = shape({
  type: string
})

// const actionParamsPropType = object

export const ActionParam = Symbol('ActionParam')
export const actionParam = ordinal => ({[ActionParam]: ordinal})

export const createAction = (parametricAction, ...params) => mapValues(param => {
  if(isObject(param) && has(ActionParam, param)){
    const index = get(ActionParam, param)
    return params[index]
  }
  else {
    return param
  }
}, parametricAction)

export const dispatchParametric = dispatch => (parametricAction, ...params) => {
  dispatch(createAction(parametricAction, ...params))
}