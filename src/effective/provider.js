import { Children } from 'react'
import { withContext } from 'recompose'
import { func } from 'prop-types'
import { renderSchedulerType } from './propTypes'

const OnlyChild = ({children}) => Children.only(children)

export const Provider = withContext({ 
  dispatch: func,
  getState: func,
  renderScheduler: renderSchedulerType
  }, ({ dispatch, getState, renderScheduler }) => ({ dispatch, getState, renderScheduler }))(
  OnlyChild
)
