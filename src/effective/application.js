import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from './provider'
import { noop, set, unset, constant } from 'lodash/fp'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { requestAnimationFrame } from '../util'
import { fragmentStore, combineFragmentReducers } from './fragmentStore'
import { componentClassRegistry } from '../componentRegistry/componentClassRegistry'

export const applicationFragmentId = 'application-fragment' // todo: enable user to pass app fragment id

export const application = (rootElementId, View, reducer, subscriptions = noop, services = {}) => {

  services = { ...services, componentClassRegistry: componentClassRegistry() }

  const store = createStore(constant({}))

  const FragmentReducers = () => {
    let reducers = {}

    return {
      install: (fragmentId, reducer, dispatch, getProps) => {
        reducers = set(fragmentId, { reducer, getProps, dispatch }, reducers)
        store.replaceReducer(combineFragmentReducers(reducers, services))
      },
      uninstall: fragmentId => {
        reducers = unset(fragmentId, reducers)
        store.replaceReducer(combineFragmentReducers(reducers, services), store.dispatch)
      }
    }
  }

  const fragmentReducers = FragmentReducers()

  const applicationFragmentStore = fragmentStore(applicationFragmentId, store)
  
  fragmentReducers.install(applicationFragmentId, reducer, applicationFragmentStore.dispatch, constant({}))

  const rootElement = document.getElementById(rootElementId)
  const scheduler = renderScheduler(requestAnimationFrame)

  const renderApp = () => render (
    <Provider store={store} 
              componentClassRegistry={services.componentClassRegistry}
              fragmentStore={applicationFragmentStore}
              fragmentId={applicationFragmentId} 
              fragmentReducers={fragmentReducers}
              renderScheduler={scheduler} 
    > 
      <View fragmentId={applicationFragmentId}/>
    </Provider>, 
    rootElement
  )
  
  window.addEventListener('beforeunload', () => unmountComponentAtNode(rootElement))
  
  subscriptions(applicationFragmentStore.dispatch)
  applicationFragmentStore.subscribe(() => scheduler.scheduleOwn().then(renderApp))
  renderApp()
}