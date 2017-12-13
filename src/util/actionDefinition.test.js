import { createAction, defineAction } from './actionDefinition'
import { bindAction, fragmentIdKey } from './bindAction'
// import { Fragment } from '../effective/fragment'
import { isEqual, identity, mapValues, keys } from 'lodash/fp'

expect.extend({
  toBeEqual: (received, argument) => {
    if(isEqual(received, argument)){
      return {
        message: () => `expected ${received} not to be equal to ${argument}`,
        pass: true
      }
    }
    else {
      return {
        message: () => `expected \n${received}\n\nto be equal to\n\n${argument}`,
        pass: false
      }
    }
  } 
})

test('create action', () => {
  expect(createAction(defineAction('x', 'count'), 5)).toEqual({type: 'x', count: 5})
})

test('create taged action', () => {
  const fragmentId = Symbol('myFragment')
  const action = defineAction('my type', 'value')
  const boundAction = bindAction(fragmentId, action)
  expect(createAction(boundAction, 9)).toEqual({ type: 'my type', value: 9, [fragmentIdKey]: fragmentId })
})

test('define action', () => {
  expect(defineAction('myType', 'x', 'y')).toEqual({ type: 'myType', paramNames: ['x', 'y'] })
})