import { noop, map, reduce, join, get, compose } from 'lodash/fp'
import { renderTree, schedule, schedule2, renderNode, isPrefix, sort } from './renderTree'

describe('isPrefix', () => {
  test('empty prefix of empty', () => {
    expect(isPrefix([], [])).toBe(true)
  })

  test('empty prefix of array', () => {
    expect(isPrefix([], [1, 2, 3])).toBe(true)
  })

  test('array prefix of empty', () => {
    expect(isPrefix([1, 2, 3], [])).toBe(false)
  })

  test('equals', () => {
    expect(isPrefix([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  test('prefix', () => {
    expect(isPrefix([1, 2], [1, 2, 3])).toBe(true)
  })

  test('non prefix', () => {
    expect(isPrefix([1, 2, 3], [1, 2])).toBe(false)
  })

  test('non prefix', () => {
    expect(isPrefix([1, 2, 3], [1, 2])).toBe(false)
  })

  test('different', () => {
    expect(isPrefix([1, 2, 3], [1, 2, 4])).toBe(false)
  })
})

describe('render tree', () => {
  test('empty', () => {
    const tree = renderTree()
    expect(tree).toEqual([])    
  })

  test('single render', () => {
    const tree = renderTree()
    const render = noop
    const tree1 = schedule(renderNode('a', noop), tree)
    expect(tree1).toEqual([renderNode('a', noop)])
  })

  test('nested, parent first', () => {
    const tree = renderTree()
    const render = noop
    const tree1 = schedule(renderNode('a', noop), tree)
    const tree2 = schedule(renderNode('a.b', noop), tree1)
    expect(tree2).toEqual([renderNode('a', noop)])    
  })

  test('nested, child first', () => {
    const tree = renderTree()
    const render = noop
    const tree1 = schedule(renderNode('a.b', noop), tree)
    const tree2 = schedule(renderNode('a', noop), tree1)
    expect(tree2).toEqual([renderNode('a', noop)])    
  })

  test('complex', () => {
    const tree = reduce((tree, s) => s(tree), renderTree(), [
      schedule(renderNode('a', noop)),
      schedule(renderNode('b.a', noop)),
      schedule(renderNode('a.b', noop)),
      schedule(renderNode('b', noop)),
      schedule(renderNode('a.b.c', noop)),
      schedule(renderNode('c.a', noop))
    ])

    expect(tree).toEqual(expect.arrayContaining([
      renderNode('b', noop),
      renderNode('a', noop),
      renderNode('c.a', noop)
    ]))
  })
})

const stringPath = join('.')

describe('', () => {
  test('', () => {
    const tree = reduce((tree, s) => s(tree), renderTree(), [
      schedule2(renderNode('a', noop)),
      schedule2(renderNode('b.a', noop)),
      schedule2(renderNode('a.b', noop)),
      schedule2(renderNode('b', noop)),
      schedule2(renderNode('a.b.c', noop)),
      schedule2(renderNode('c.a', noop))
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