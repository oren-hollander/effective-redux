import registerServiceWorker from './registerServiceWorker'
import { mapStateToProps } from './effective/effective'
import { App } from './app/app'
import { reducer } from './app/reducer'
import { selectCount, selectColor } from './app/selectors'
import { asyncInc } from './app/actions'
import { application } from './effective/application'

const AppWithProps = mapStateToProps({count: selectCount, color: selectColor})(App)
const subscriptions = dispatch => setInterval(() => dispatch(asyncInc()), 20000)
application('root', AppWithProps, reducer, undefined, window.sessionStorage)

// import { main } from './starWars/app'

// main('root')

registerServiceWorker()
