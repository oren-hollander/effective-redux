import { componentClassRegistry } from './componentClassRegistry'

describe('component class registry', () => {
  const registry = componentClassRegistry()
  const componentClassId = 'componentClassId'
  const componentClass = () => {}

  test('unregistered component', () => {
    expect(registry.get(componentClassId)).toBeUndefined()
  })

  test('register component', () => {
    registry.register(componentClassId, componentClass)
    expect(registry.get(componentClassId)).toBe(componentClass)
  })

  test('unregister component', () => {
    registry.register(componentClassId, componentClass)
    registry.unregister(componentClassId)
    expect(registry.get(componentClassId)).toBeUndefined()
  })

})