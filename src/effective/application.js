import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { Provider } from './effective'
import { windowAnimationFrameRenderer } from './animationFrameRenderer'

export const application = (rootElementId, View, reducer, subscriptions) => {
  const store = createStore(reducer, effectiveStoreEnhancer())
  const rootElement = document.getElementById(rootElementId)

  const render = () => ReactDOM.render(
    <Provider store={store}>
      <View/>
    </Provider>, 
    rootElement
  )

  subscriptions(store.dispatch)
  store.subscribe(windowAnimationFrameRenderer(render))
  render()
}