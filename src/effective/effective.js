import { Children } from 'react'
import { withContext, getContext, withProps, compose } from 'recompose'
import { mapValues } from 'lodash/fp'
import { object, string } from 'prop-types'

const OnlyChild = ({children}) => Children.only(children)

export const Provider = withContext({ 
  store: object,
  scheduleRender: object,
  fragmentPath: string
  }, ({ store, scheduleRender, fragmentPath }) => ({ store, scheduleRender, fragmentPath }))(
  OnlyChild
)

export const dispatching = compose(
  getContext({store: object}),
  withProps(({store}) => ({dispatch: store.dispatch}))
)

export const mapStateToProps = selectors => compose(
  getContext({store: object}),
  withProps(({store}) => mapValues(selector => selector(store.getState()), selectors))
)