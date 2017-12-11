import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { Provider } from './provider'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { requestAnimationFrame } from '../util'

export const application = (rootElementId, View, store) => {

  const rootElement = document.getElementById(rootElementId)
  const scheduler = renderScheduler(requestAnimationFrame)

  const renderApp = () => render (
    <Provider renderScheduler={scheduler} dispatch={store.dispatch} getState={store.getState}> 
      <View/>
    </Provider>, 
    rootElement
  )
  
  window.addEventListener('beforeunload', () => unmountComponentAtNode(rootElement))
  
  store.subscribe(() => scheduler.scheduleOwn().then(renderApp))
  renderApp()
}