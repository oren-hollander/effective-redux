import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { Provider } from './provider'
import { noop } from 'lodash/fp'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { requestAnimationFrame } from '../util'

export const applicationFragmentId = Symbol('application fragment')

export const application = (rootElementId, View, reducer, subscriptions = noop) => {

  const store = createStore(reducer, effectiveStoreEnhancer())
  const rootElement = document.getElementById(rootElementId)
  const scheduler = renderScheduler(requestAnimationFrame)

  const renderApp = () => render (
    <Provider fragmentId={applicationFragmentId} renderScheduler={scheduler} dispatch={store.dispatch} getState={store.getState}> 
      <View fragmentInstanceId={applicationFragmentId}/>
    </Provider>, 
    rootElement
  )
  
  window.addEventListener('beforeunload', () => unmountComponentAtNode(rootElement))
  
  subscriptions(store.dispatch)
  store.subscribe(() => scheduler.scheduleOwn().then(renderApp))
  renderApp()
}