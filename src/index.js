import registerServiceWorker from './registerServiceWorker'
import { application } from './effective/application'
import { mapStateToProps } from './effective/mapStateToProps'
import { App } from './app/app'
import { reducer } from './app/reducer'
import { asyncInc } from './app/actions'
import { selectCount, selectColor } from './app/selectors'

import { interval } from './effective/subscriptions/interval'
import { localStateStorage } from './util/stateStorage'
import { componentClassRegistry } from './componentRegistry/componentClassRegistry'
import { service } from './effective/services/service'

const AppWithProps = mapStateToProps(state => ({count: selectCount(state), color: selectColor(state)}))(App)

const subscriptions = interval(200000, asyncInc)
const services = [service('componentClassRegistry', componentClassRegistry(), true)]
application('root', AppWithProps, reducer, subscriptions, services, localStateStorage)

registerServiceWorker()