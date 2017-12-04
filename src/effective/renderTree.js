import { curry, toPath, sortBy, sortedUniqBy, get, compose } from 'lodash/fp'

export const renderNode = (path, render) => ({ path: toPath(path), render })
export const renderTree = () => []

export const schedule = curry((node, tree) => [...tree, node])

const byPath = get('path')

export const sort = tree => compose(
  sortedUniqBy(byPath),
  sortBy(byPath)
)(tree)