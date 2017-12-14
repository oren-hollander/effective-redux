import { forEach, has, flow, eq, set, get, unset, concat, partition } from 'lodash/fp'
import { invoke } from '../util/invoke'

export const componentClassRegistry = () => {
  let components = {}
  let resolvers = []

  const registerComponentClass = (componentClassId, componentClass) => {
    components = set(componentClassId, componentClass, components)
    const [waiting, nonWaiting] = partition(flow(get('componentClassId'), eq(componentClassId)), resolvers)
    resolvers = nonWaiting
    forEach(
      flow(
        get('resolve'), 
        invoke(componentClass)
      ), 
      waiting
    )
  }

  const unregisterComponentClass = componentClassId => {
    components = unset(componentClassId, components)
  }

  const getComponentClass = componentClassId => get(componentClassId, components)

  const waitForComponentClass = async componentClassId => 
    has(componentClassId, components) 
      ? get(componentClassId, components)
      : new Promise(resolve => {
        resolvers = concat(resolvers, { componentClassId, resolve })
      })

  return {
    registerComponentClass,
    unregisterComponentClass,
    getComponentClass,
    waitForComponentClass
  }
}