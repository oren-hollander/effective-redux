import { getContext, withProps, compose } from 'recompose'
import { object } from 'prop-types'

export const dispatching = compose(
  getContext({store: object}),
  withProps(({store}) => ({dispatch: store.dispatch}))
)
