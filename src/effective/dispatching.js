import { getContext, withProps, compose } from 'recompose'
import { storePropType } from './propTypes'

export const dispatching = compose(
  getContext({store: storePropType}),
  withProps(({store}) => ({dispatch: store.dispatch}))
)
