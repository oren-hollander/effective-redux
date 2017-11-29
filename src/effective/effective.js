import { Children, Component } from 'react'
import { withContext, getContext, mapProps, compose } from 'recompose'
import { mapValues } from 'lodash/fp'
import { func, object } from 'prop-types'

export const Effective = withContext({
  emit: func, 
  store: object, 
  installComponentReducer: func, 
  uninstallComponentReducer: func
}, ({store, installComponentReducer, uninstallComponentReducer}) => 
  ({
    store,
    emit: action => store.dispatch(action),
    installComponentReducer, 
    uninstallComponentReducer
  })
)(
  ({children}) => Children.only(children)
)

export class Effective2 extends Component {
  static propTypes = {
    store: object
  }

  static childContextTypes = {
    store: object,
    emit: func,
    installComponentReducer: func, 
    uninstallComponentReducer: func
  }

  getChildContext() {
    return {

    }
  }

  render(){
    return Children.only(this.props.children)
  }
}

export const emitting = getContext({emit: func}) //todo rewrite using store on context

export const mapStateToProps = selectors =>
  compose(
    getContext({store: object}),
    mapProps(({store}) => { // maybe use withProps
      return mapValues(selector => selector(store.getState()), selectors)
    })
  )