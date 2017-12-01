import { identity } from 'lodash/fp'
import { lift, liftArray, liftPromise, liftArrow, liftClass } from './lift'

describe('lift', () => {
  test('lift', () => {
    const liftEven = lift(value => value % 2 === 0, value => value + 1)
    expect(liftEven(2)).toBe(2)
    expect(liftEven(1)).toBe(2)
  })

  describe('lift array', () => {
    test('lift an array', () => {
      expect(liftArray([1, 2, 3])).toEqual([1, 2, 3])
    })

    test('lift a non array', () => {
      expect(liftArray(1)).toEqual([1])
    })
  })

  describe('lift promise', () => {
    test('lift a promise', async () => {
      expect(await liftPromise(Promise.resolve(1))).toEqual(1)
    })

    test('lift a non promise', async () => {
      expect(await liftPromise(1)).toEqual(1)
    })
  })

  describe('lift function', () => {
    test('lift a function', () => {
      expect(liftArrow(identity)(2)).toEqual(2)
    })

    test('lift a non promise', () => {
      expect(liftArrow(2)(2)).toEqual(2)
    })
  })

  describe('lift class', () => {
    let MyClass
    let liftMyClass

    beforeEach(() => {
      MyClass = class {
        constructor(value) {
          this.value = value
        }
      }
      liftMyClass = liftClass(MyClass)
    })

    test('lift a class', () => {
      expect(liftMyClass(new MyClass('hello')).value).toBe('hello')
    })

    test('lift a non class', () => {
      expect(liftMyClass('hello').value).toBe('hello')
    })
  })
})