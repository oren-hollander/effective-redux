import { command, commandWithServices, execute } from './command'
import { reduce, times, constant } from 'lodash/fp'

const add = (a, b) => a + b
const multiply = commandWithServices(async ({ add }, a, b) => reduce(add, 0, times(constant(a), b)))

describe('command', () => {
  test('with service', () => {
    return execute({ add })(multiply(3, 4))
      .then(r => expect(r).toBe(12))
  })
})