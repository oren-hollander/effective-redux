import { Children } from 'react'
import { withContext } from 'recompose'
import { string } from 'prop-types'
import { storePropType, renderSchedulerType } from './propTypes'

const OnlyChild = ({children}) => Children.only(children)

export const Provider = withContext({ 
  store: storePropType,
  renderScheduler: renderSchedulerType,
  fragmentPath: string
  }, ({ store, renderScheduler, fragmentPath }) => ({ store, renderScheduler, fragmentPath }))(
  OnlyChild
)
