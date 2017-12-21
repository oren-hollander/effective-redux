import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from './provider'
import { flow, noop, set, unset, constant, identity, map, mapValues, filter, fromPairs } from 'lodash/fp'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { requestAnimationFrame } from '../util'
import { fragmentStore, combineFragmentReducers } from './fragmentStore'

export const applicationFragmentId = 'application-fragment' // todo: enable user to pass app fragment id

const noopStorage = {
  load: constant({}),
  save: noop
}

export const application = (rootElementId, View, reducer, subscriptions = noop, serviceDefinitions = [], storage = noopStorage) => {

  const createServices = flow(
    map(serviceDefinition => [serviceDefinition.name, serviceDefinition.api]),
    fromPairs
  )

  const services = createServices(serviceDefinitions)

  const contextServices = flow(
    filter('provideOnContext'),
    createServices
  )(serviceDefinitions)

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

  console.log(contextServices)
  const renderApp = () => render (
    <Provider store={fragmentReducers.store} 
              services={contextServices}
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