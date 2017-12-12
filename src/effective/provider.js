import { Children } from 'react'
import { withContext } from 'recompose'
import { func, symbol } from 'prop-types'
import { renderSchedulerType } from './propTypes'

const OnlyChild = ({children}) => Children.only(children)

export const Provider = withContext({ 
  fragmentId: symbol,
  dispatch: func,
  getState: func,
  renderScheduler: renderSchedulerType
  }, ({ fragmentId, dispatch, getState, renderScheduler }) => ({ fragmentId, dispatch, getState, renderScheduler }))(
  OnlyChild
)
