import { defaultTo } from 'lodash/fp'

export const setItemToLocalStorage = async (successActionCreator, key, value) =>
 {
  window.localStorage.setItem(key, JSON.stringify(value))
  return successActionCreator()
}

export const getItemFromLocalStorage = async (successActionCreator, key) => {
  try {
    return successActionCreator(defaultTo(undefined, JSON.parse(window.localStorage.getItem(key))))
  }
  catch(e){
    return successActionCreator({})
  }
}
