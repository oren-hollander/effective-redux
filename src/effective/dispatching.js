import { getContext, withProps, compose } from 'recompose'
import { storePropType } from './propTypes'

export const dispatching = compose(
  getContext({ fragmentStore: storePropType }),
  withProps(({ fragmentStore }) => ({ dispatch: fragmentStore.dispatch }))
)
