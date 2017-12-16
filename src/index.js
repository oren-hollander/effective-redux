import registerServiceWorker from './registerServiceWorker'
import { application, mapStateToProps } from './effective'
import { App, reducer, selectCount, selectColor, asyncInc } from './app'
import { interval } from './effective/subscriptions'
import { localStateStorage } from './util/stateStorage'

const AppWithProps = mapStateToProps(state => ({count: selectCount(state), color: selectColor(state)}))(App)

const subscriptions = interval(500000, asyncInc)

application('root', AppWithProps, reducer, subscriptions, undefined, localStateStorage)

registerServiceWorker()