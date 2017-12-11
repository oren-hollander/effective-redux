import thunk from 'redux-thunk'
import registerServiceWorker from './registerServiceWorker'
import { application, mapStateToProps } from './effective'
import { App, reducer, selectCount, selectColor } from './app'
import { createStore, applyMiddleware } from 'redux'

const AppWithProps = mapStateToProps(state => ({count: selectCount(state), color: selectColor(state)}))(App)
const store = createStore(reducer, applyMiddleware(thunk))

application('root', AppWithProps, store)

registerServiceWorker()