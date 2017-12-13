import { componentClassRegistry } from './componentClassRegistry'

describe('component class registry', () => {
  let registry
  const componentClassId = 'componentClassId'
  const componentClass = () => {}
  
  beforeEach(() => {
    registry = componentClassRegistry()
  })
  
  test('unregistered component', () => {
    expect(registry.getComponentClass(componentClassId)).toBeUndefined()
  })

  test('register component', () => {
    registry.registerComponentClass(componentClassId, componentClass)
    expect(registry.getComponentClass(componentClassId)).toBe(componentClass)
  })

  test('unregister component', () => {
    registry.registerComponentClass(componentClassId, componentClass)
    registry.unregisterComponentClass(componentClassId)
    expect(registry.getComponentClass(componentClassId)).toBeUndefined()
  })

  test('wait for componebt before registering', () => {
    const p = registry.waitForComponentClass(componentClassId)
      .then(loadedComponentClass => expect(loadedComponentClass).toBe(componentClass))
    registry.registerComponentClass(componentClassId, componentClass)
    return p
  })

  test('wait for component after registering', () => {
    registry.registerComponentClass(componentClassId, componentClass)
    return registry.waitForComponentClass(componentClassId)
      .then(loadedComponentClass => expect(loadedComponentClass).toBe(componentClass))
  })
})