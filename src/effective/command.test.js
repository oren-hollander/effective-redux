import { command, execute } from './command'
import { reduce, times, constant } from 'lodash/fp'

describe('command', () => {
  test('with service', async () => {
    const add = (a, b) => a + b
    const multiply = add => async (a, b) => reduce(add, 0, times(constant(a), b))
    const multiplyCommand = command(multiply, 'add')
    const r = await execute({ add })(multiplyCommand(3, 4))
    expect(r).toBe(12)
  })

  test('define command', async () => {
    const services = { serviceA: 'service A', serviceB: 'service B'}

    const f = (serviceA, serviceB) => async (paramA, paramB) => {
      return {serviceA, serviceB, paramA, paramB}
    }

    const cmd = command(f, 'serviceA', 'serviceB')('param A', 'param B')
    const result = await execute(services)(cmd)
    expect(result).toEqual({ serviceA: 'service A', serviceB: 'service B', paramA: 'param A', paramB: 'param B' })
  })
})