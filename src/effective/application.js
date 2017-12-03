import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { Provider } from './effective'
import { noop } from 'lodash/fp'
import { hierarchicalRenderScheduler } from './hierarchicalRenderScheduler'

export const application = (rootElementId, View, reducer, subscriptions = noop) => {

  const store = createStore(reducer, effectiveStoreEnhancer())
  const rootElement = document.getElementById(rootElementId)
  const scheduleRender = hierarchicalRenderScheduler(window.requestAnimationFrame)

  const renderApp = () => render (
    <Provider store={store} scheduleRender={scheduleRender} fragmentPath='app'>
      <View/>
    </Provider>, 
    rootElement
  )
  
  window.addEventListener('beforeunload', () => unmountComponentAtNode(rootElement))
  
  subscriptions(store.dispatch)
  store.subscribe(() => scheduleRender('app', renderApp))
  renderApp()
}