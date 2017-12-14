import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from './provider'
import { noop, set, unset, constant } from 'lodash/fp'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { requestAnimationFrame } from '../util'
import { componentClassRegistry } from '../componentRegistry/componentClassRegistry'
import { fragmentStore, combineFragmentReducers } from './fragmentStore'

export const applicationFragmentId = 'application-fragment'

export const application = (rootElementId, View, reducer, subscriptions = noop) => {

  const store = createStore(constant({}))

  const FragmentReducers = () => {
    let reducers = {}

    return {
      install: (fragmentId, reducer, dispatch, getProps) => {
        reducers = set(fragmentId, { reducer, getProps, dispatch }, reducers)
        store.replaceReducer(combineFragmentReducers(reducers))
      },
      uninstall: fragmentId => {
        reducers = unset(fragmentId, reducers)
        store.replaceReducer(combineFragmentReducers(reducers), store.dispatch)
      }
    }
  }

  const fragmentReducers = FragmentReducers()

  const applicationFragmentStore = fragmentStore(applicationFragmentId, store)
  
  fragmentReducers.install(applicationFragmentId, reducer, applicationFragmentStore.dispatch, constant({}))

  const rootElement = document.getElementById(rootElementId)
  const scheduler = renderScheduler(requestAnimationFrame)
  const registry = componentClassRegistry()

  const renderApp = () => render (
    <Provider store={store} fragmentStore={applicationFragmentStore} fragmentId={applicationFragmentId} componentClassRegistry={registry} fragmentReducers={fragmentReducers}
              renderScheduler={scheduler} > 
      <View fragmentId={applicationFragmentId}/>
    </Provider>, 
    rootElement
  )
  
  window.addEventListener('beforeunload', () => unmountComponentAtNode(rootElement))
  
  subscriptions(applicationFragmentStore.dispatch)
  applicationFragmentStore.subscribe(() => scheduler.scheduleOwn().then(renderApp))
  renderApp()
}