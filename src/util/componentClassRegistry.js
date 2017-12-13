import { set, get, unset, flip } from 'lodash/fp'

export const componentClassRegistry = () => {
  let components = []
  const register = (componentClassId, componentClass) => {
    components = set(componentClassId, componentClass, components)
  }

  const unregister = componentClassId => {
    components = unset(componentClassId, components)
  }

  const getComponentClass = componentClassId => get(componentClassId, components)

  return {
    register,
    unregister,
    get: getComponentClass
  }
}