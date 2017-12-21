import registerServiceWorker from './registerServiceWorker'
import { application, mapStateToProps } from './effective'
import { App, reducer, selectCount, selectColor, asyncInc } from './app'
import { interval } from './effective/subscriptions'
import { localStateStorage } from './util/stateStorage'
import { componentClassRegistry } from './componentRegistry/componentClassRegistry'
import { service } from './effective/services/service'

const AppWithProps = mapStateToProps(state => ({count: selectCount(state), color: selectColor(state)}))(App)

const subscriptions = interval(500000, asyncInc)
const services = [service('componentClassRegistry', componentClassRegistry(), true)]
application('root', AppWithProps, reducer, subscriptions, services, localStateStorage)

registerServiceWorker()