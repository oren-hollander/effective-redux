import registerServiceWorker from './registerServiceWorker'
import { application, mapStateToProps } from './effective'
import { App, reducer, selectCount, selectColor, asyncInc, load, unload } from './app'
import { appLifecycle, combineSubscriptions, interval } from './effective/subscriptions'

const AppWithProps = mapStateToProps(state => ({count: selectCount(state), color: selectColor(state)}))(App)

const subscriptions = combineSubscriptions(interval(200000, asyncInc), appLifecycle(load, unload))
application('root', AppWithProps, reducer, subscriptions)

registerServiceWorker()