export const appLifecycle = (loadAction, unloadAction) => dispatch => {
  dispatch(loadAction)
  window.addEventListener('beforeunload', () => dispatch(unloadAction))
}