import { Children } from 'react'
import { withContext, getContext, withProps, compose } from 'recompose'
import { mapValues } from 'lodash/fp'
import { object } from 'prop-types'

const OnlyChild = ({children}) => Children.only(children)

export const Provider = withContext({ store: object }, ({ store }) => ({ store }))(
  OnlyChild
)

export const emitting = compose(
  getContext({store: object}),
  withProps(({store}) => ({emit: store.dispatch}))
)

export const mapStateToProps = selectors => compose(
  getContext({store: object}),
  withProps(({store}) => mapValues(selector => selector(store.getState()), selectors))
)