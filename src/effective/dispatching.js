import { getContext, withProps, compose } from 'recompose'
import { fragmentStorePropType } from './propTypes'

export const dispatching = compose(
  getContext({ fragmentStore: fragmentStorePropType }),
  withProps(({ fragmentStore }) => ({ dispatch: fragmentStore.dispatch }))
)
