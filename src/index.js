import registerServiceWorker from './registerServiceWorker'
import { mapStateToProps } from './effective/effective'
import { App } from './app/app'
import { reducer } from './app/reducer'
import { selectCount, selectColor } from './app/selectors'
import { asyncInc, load, unload } from './app/actions'
import { application } from './effective/application'
import { interval } from './effective/subscriptions/intervalSubscription'
import { combineSubscriptions } from './effective/subscriptions/combineSubscriptions'
import { appLifecycle } from './effective/subscriptions/appLifecycle'

const AppWithProps = mapStateToProps({count: selectCount, color: selectColor})(App)

const subscriptions = combineSubscriptions(interval(20000, asyncInc), appLifecycle(load, unload))
application('root', AppWithProps, reducer, subscriptions)

registerServiceWorker()
