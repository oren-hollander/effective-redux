import { idGenerator } from './idGenerator'

test('id generator', () => {
  const gen = idGenerator('prefix-')
  expect(gen()).toBe('prefix-1')
  expect(gen()).toBe('prefix-2')
})