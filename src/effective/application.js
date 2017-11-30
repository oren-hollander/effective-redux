import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { Provider } from './effective'
import { windowAnimationFrameRenderer } from './animationFrameRenderer'
import { noop, defaultTo, isUndefined } from 'lodash/fp'
import { noStorage } from './noStorage'

const storageKey = 'effective/app'

export const application = (rootElementId, View, reducer, subscriptions = noop, storage = noStorage) => {
  const storageValue = defaultTo(undefined, storage.getItem(storageKey))
  const preloadedState = isUndefined(storageValue) ? undefined : JSON.parse(storageValue)

  const store = createStore(reducer, preloadedState, effectiveStoreEnhancer())
  const rootElement = document.getElementById(rootElementId)

  const renderApp = () => render (
    <Provider store={store}>
      <View/>
    </Provider>, 
    rootElement
  )

  window.onbeforeunload = () => {
    storage.setItem(storageKey, JSON.stringify(store.getState()))
    unmountComponentAtNode(rootElement)
  }
  
  subscriptions(store.dispatch)
  store.subscribe(windowAnimationFrameRenderer(renderApp))
  renderApp()
}