import { defaultTo } from 'lodash/fp'
import { command } from '../command'
import { createAction } from '../../util/actionDefinition'

export const setItemToLocalStorage = command(async (successAction, key, value) =>
{
  window.localStorage.setItem(key, JSON.stringify(value))
  return successAction
})

export const getItemFromLocalStorage = command(async (successAction, key) => {
  try {
    return createAction(successAction, defaultTo(undefined, JSON.parse(window.localStorage.getItem(key))))
  }
  catch(e){
    return createAction(successAction, {})
  }
})
