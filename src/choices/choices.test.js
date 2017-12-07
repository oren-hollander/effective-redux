import { sortBy, identity, sortedIndexBy, head, last, max, compose, reverse, size, keys } from 'lodash/fp'

const sort = array => sortBy(identity, array)

const greatestWithSorting = compose(last, sort)
const greatestWithoutSorting = compose(max, identity)
const greatestWithoutSorting2 = compose(max, reverse)

const Tag = Symbol('tag')

const SortLast = 'sort last'
const Max = 'max'
const ReverseMax = 'reverse max'

const log = message => f => (...arg) => {
  console.log(message)
  return f(...arg)
}

const prepare = choices => {
  const s = size(choices)
  let i = s - 1

  return arg => {
    i = (i + 1) % s
    const key = keys(choices)[i]
    const r = choices[key](arg)
    r[Tag] = key
    return r
  }
}

const step = choices => {
  return arg => {
    const key = arg[Tag]
    const r = choices[key](arg)
    return r
  }
}

const prepareGreatest = prepare({
  [SortLast]: sort,
  [Max]: identity,
  [ReverseMax]: reverse
})

const findGreatest = step({
  [SortLast]: log('last')(last),
  [Max]: log('max')(max),
  [ReverseMax]: log('reverse')(max)
})

describe('greatest', () => {
  const array = [3, 6, 2, 7, 9, 1, 5]

  test('greatest with sorting', () => {
    expect(greatestWithSorting(array)).toBe(9)
  })

  test('greatest without sorting', () => {
    expect(greatestWithoutSorting(array)).toBe(9)
  })

  test('', () => {
    const greatest = compose(findGreatest, prepareGreatest)
    expect(greatest([1, 2, 3])).toBe(3)
    expect(greatest([1, 2, 3])).toBe(3)
    expect(greatest([1, 2, 3])).toBe(3)
    expect(greatest([1, 2, 3])).toBe(3)
    expect(greatest([1, 2, 3])).toBe(3)
    expect(greatest([1, 2, 3])).toBe(3)
  })
})
