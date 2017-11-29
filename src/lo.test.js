import { remove, eq, get, compose } from 'lodash/fp'

test('', () => {
  const x = [{id: 1}, {id: 2}, {id: 3}]
  expect(remove(compose(eq(2), get('id')), x)).toEqual([{id: 1}, {id: 3}])
})