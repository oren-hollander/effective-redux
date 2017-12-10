import { getContext, withProps, compose } from 'recompose'
import { func } from 'prop-types'

export const dispatching = compose(
  getContext({dispatch: func}),
  withProps(({dispatch}) => ({dispatch}))
)
