import { defaultTo } from 'lodash/fp'
import { command } from '../command'

export const setItemToLocalStorage = command(async (successActionCreator, key, value) =>
{
  window.localStorage.setItem(key, JSON.stringify(value))
  return successActionCreator()
})

export const getItemFromLocalStorage = command(async (successActionCreator, key) => {
  try {
    return successActionCreator(defaultTo(undefined, JSON.parse(window.localStorage.getItem(key))))
  }
  catch(e){
    return successActionCreator({})
  }
})
