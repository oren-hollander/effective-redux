import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effective/effectiveStoreEnhancer'
import { mapStateToProps, Effective } from './effective/effective'
import { windowAnimationFrameRenderer } from './effective/animationFrameRenderer'
import { App } from './app/App'
import { reducer } from './app/reducer'
import { selectCount, selectColor } from './app/selectors'
import { inc } from './app/actions'

const store = createStore(reducer, effectiveStoreEnhancer())

const AppWithProps = mapStateToProps({count: selectCount, color: selectColor})(App)

const render = () => ReactDOM.render(
  <Effective store={store}>
    <AppWithProps/>
  </Effective>, 
  document.getElementById('root')
)

store.subscribe(windowAnimationFrameRenderer(render))

render()

setInterval(() => {
  store.dispatch(inc())
}, 20000)

registerServiceWorker()
