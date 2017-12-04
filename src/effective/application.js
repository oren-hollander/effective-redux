import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { Provider } from './provider'
import { noop } from 'lodash/fp'
import { hierarchicalRenderScheduler } from './hierarchicalRenderScheduler'

export const application = (rootElementId, View, reducer, subscriptions = noop) => {

  const store = createStore(reducer, effectiveStoreEnhancer())
  const rootElement = document.getElementById(rootElementId)
  const renderScheduler = hierarchicalRenderScheduler(window.requestAnimationFrame)

  const renderApp = () => render (
    <Provider store={store} renderScheduler={renderScheduler} fragmentPath='app'>
      <View/>
    </Provider>, 
    rootElement
  )
  
  window.addEventListener('beforeunload', () => unmountComponentAtNode(rootElement))
  
  subscriptions(store.dispatch)
  store.subscribe(() => renderScheduler('app', renderApp))
  renderApp()
}