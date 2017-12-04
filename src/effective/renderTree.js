import { curry, remove, toPath, isEmpty, head, tail, find, isUndefined, sortBy, sortedUniqBy, get, compose } from 'lodash/fp'

export const renderNode = (path, render) => ({ path: toPath(path), render })
export const renderTree = () => []

export const isPrefix = (as, bs) => {
  if(isEmpty(as))
    return true

  if(isEmpty(bs))
    return false

  return head(as) === head(bs) && isPrefix(tail(as), tail(bs))
}

export const schedule = curry((node, tree) => { 
  const parentExists = !isUndefined(find(n => isPrefix(n.path, node.path), tree))
  if(parentExists)
    return tree
  
  const treeWithoutChildNodes = remove(n => isPrefix(node.path, n.path), tree)
  return [...treeWithoutChildNodes, node]
})

export const schedule2 = curry((node, tree) => [...tree, node])
const byPath = get('path')

export const sort = tree => compose(
  sortedUniqBy(byPath),
  sortBy(byPath)
)(tree)