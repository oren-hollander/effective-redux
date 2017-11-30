import registerServiceWorker from './registerServiceWorker'
import { mapStateToProps } from './effective/effective'
import { App } from './app/app'
import { reducer } from './app/reducer'
import { selectCount, selectColor } from './app/selectors'
import { asyncInc } from './app/actions'
import { application } from './effective/application'

const AppWithProps = mapStateToProps({count: selectCount, color: selectColor})(App)

application('root', AppWithProps, reducer, dispatch => {
  setInterval(() => dispatch(asyncInc()), 20000)
})

registerServiceWorker()
