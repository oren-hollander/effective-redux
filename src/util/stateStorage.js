import { defaultTo } from 'lodash/fp'

const load = key => {
  try {
    const state = JSON.parse(window.localStorage.getItem(key))
    return defaultTo(undefined, state)
  }
  catch(e){
    return {}
  }
}

const save = (key, state) => {
  window.localStorage.setItem(key, JSON.stringify(state))
}

export const localStateStorage = { load, save }