import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from './provider'
import { noop, set, unset, constant, identity, mapValues } from 'lodash/fp'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { requestAnimationFrame } from '../util'
import { fragmentStore, combineFragmentReducers } from './fragmentStore'
import { componentClassRegistry } from '../componentRegistry/componentClassRegistry'

export const applicationFragmentId = 'application-fragment' // todo: enable user to pass app fragment id

const noopStorage = {
  load: constant({}),
  save: noop
}

export const application = (rootElementId, View, reducer, subscriptions = noop, services = {}, storage = noopStorage) => {

  services = { ...services, componentClassRegistry: componentClassRegistry() }

  const FragmentReducers = () => {
    
    
    const voidReducer = { reducer: identity, getProps: constant({}), dispatch: noop }
    const preloadedState = storage.load(applicationFragmentId)
    let reducers = mapValues(() => voidReducer, preloadedState)
    const store = createStore(identity, preloadedState)//, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    
    return {
      store,
      install: (fragmentId, reducer, dispatch, getProps) => {
        reducers = set(fragmentId, { reducer, getProps, dispatch }, reducers)
        store.replaceReducer(combineFragmentReducers(reducers, services))
      },
      uninstall: (fragmentId, persist = false) => {
        reducers = persist 
          ? set(fragmentId, voidReducer, reducers)
          : unset(fragmentId, reducers)
        store.replaceReducer(combineFragmentReducers(reducers, services), store.dispatch)
      }
    }
  }

  const fragmentReducers = FragmentReducers()

  const applicationFragmentStore = fragmentStore(applicationFragmentId, fragmentReducers.store)
  
  fragmentReducers.install(applicationFragmentId, reducer, applicationFragmentStore.dispatch, constant({}))

  const rootElement = document.getElementById(rootElementId)
  const scheduler = renderScheduler(requestAnimationFrame)

  const renderApp = () => render (
    <Provider store={fragmentReducers.store} 
              componentClassRegistry={services.componentClassRegistry}
              fragmentStore={applicationFragmentStore}
              fragmentId={applicationFragmentId} 
              fragmentReducers={fragmentReducers}
              renderScheduler={scheduler}> 
      <View fragmentId={applicationFragmentId}/>
    </Provider>, 
    rootElement
  )

  window.addEventListener('beforeunload', () => {
    unmountComponentAtNode(rootElement)
    storage.save(applicationFragmentId, fragmentReducers.store.getState())
  })

  subscriptions(applicationFragmentStore.dispatch)
  applicationFragmentStore.subscribe(() => scheduler.scheduleOwn().then(renderApp))
  renderApp()
}