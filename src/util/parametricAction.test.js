import { createAction, actionParam } from './parametricAction'

test('parametricAction', () => {
  expect(createAction({type: 'x', count: actionParam(0)}, 5)).toEqual({type: 'x', count: 5})
})