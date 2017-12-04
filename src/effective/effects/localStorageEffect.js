import { defaultTo } from 'lodash/fp'

export const setItemToLocalStorage = (successActionCreator, key, value) => async () =>
{
  window.localStorage.setItem(key, JSON.stringify(value))
  return successActionCreator()
}

export const getItemFromLocalStorage = (successActionCreator, key) => async () => {
  try {
    return successActionCreator(defaultTo(undefined, JSON.parse(window.localStorage.getItem(key))))
  }
  catch(e){
    return successActionCreator({})
  }
}
