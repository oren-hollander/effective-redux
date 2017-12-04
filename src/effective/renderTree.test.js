import { noop, map, reduce, join, get, compose } from 'lodash/fp'
import { renderTree, schedule, schedule2, renderNode, isPrefix, sort } from './renderTree'

const stringPath = join('.')

describe('render tree', () => {
  test('sorting', () => {
    const tree = reduce((tree, s) => s(tree), renderTree(), [
      schedule(renderNode('a', noop)),
      schedule(renderNode('b.a', noop)),
      schedule(renderNode('a.b', noop)),
      schedule(renderNode('b', noop)),
      schedule(renderNode('a.b.c', noop)),
      schedule(renderNode('c.a', noop))
    ])

    const sortedTree = sort(tree)
    expect(map(compose(stringPath, get('path')), sortedTree)).toEqual([
      'a',
      'a.b',
      'a.b.c',
      'b',
      'b.a',
      'c.a'
    ])
  })
})