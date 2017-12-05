export const fragmentsStoreEnhancer = () => nextStoreCreator => (reducer, preloadedState) => {
  
  return nextStoreCreator(reducer, preloadedState)
}