export const setItemToLocalStorage = async (successActionCreator, key, value) => {
  window.localStorage.setItem(key, value)
  return successActionCreator()
}

export const getItemFromLocalStorage = async (successActionCreator, key) => 
  successActionCreator(window.localStorage.getItem(key))
