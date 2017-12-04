import { curry, sortBy, get, head, tail, reduce, isEmpty, size, concat, last, initial, some } from 'lodash/fp'

let id = 0
const nextId = () => ++id

const box = (x, y, w, h) => ({ id: nextId(), x, y, w, h })

const left = box => box.x
const top = box => box.y
const right = box => box.x + box.w
const bottom = box => box.y + box.h

const overlapAbove = (a, b) => top(a) <= top(b) && bottom(a) > top(b)
const overlapping = curry((a, b) => overlapAbove(a, b) || overlapAbove(b, a))

const b = (y, h) => box(100, y, 100, h)

const partition = (boxes, partitions = []) => {

  boxes = sortBy(get('h'), boxes)

  const addToPartitions = (box, partitions) => {
    if(isEmpty(partitions))
      return concat(partitions, [[box]])
    
    const lastPartition = last(partitions)
    if(some(overlapping(box), lastPartition))
      return concat(initial(partitions), [concat(lastPartition, box)])
    else
      return concat(partitions, [[box]])
  }

  if(isEmpty(boxes))
    return partitions

  return partition(tail(boxes), addToPartitions(head(boxes), partitions))
}

describe('overlapping boxes', () => {
  test('overlap above', () => {
    expect(overlapAbove(b(10, 20), b(15, 25))).toBe(true)
  })

  test('non overlap above', () => {
    expect(overlapAbove(b(10, 20), b(30, 40))).toBe(false)
  })

  test('non overlapping', () => {
    expect(overlapping(b(0, 10), b(20, 30))).toBe(false)    
  })
  
  test('overlapping boxes', () => {
    expect(overlapping(b(0, 10), b(5, 15))).toBe(true)    
  })

  test('non overlapping with common top/bottom', () => {
    expect(overlapping(b(0, 10), b(10, 20))).toBe(false)
  })

  test('overlapping boxes with common top', () => {
    expect(overlapping(b(0, 10), b(0, 20))).toBe(true)
  })

  test('overlapping boxes with common bottom', () => {
    expect(overlapping(b(0, 20), b(10, 20))).toBe(true)
  })

  test('overlapping equal boxes', () => {
    expect(overlapping(b(0, 10), b(0, 10))).toBe(true)
  })
})

test('non overlapping partition', () => {
  const b1 = b(0, 10)
  const b2 = b(20, 30)
  const boxes = [b2, b1]
  expect(partition(boxes)).toEqual([[b1], [b2]])
})

test('overlapping partition', () => {
  const b1 = b(0, 10)
  const b2 = b(5, 15)
  const boxes = [b1, b2]
  expect(partition(boxes)).toEqual([[b1, b2]])
})
