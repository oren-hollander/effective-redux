import { Children } from 'react'
import { withContext } from 'recompose'
import { string, object } from 'prop-types'
import { renderSchedulerType, storePropType, fragmentReducersPropType } from './propTypes'

const OnlyChild = ({ children }) => Children.only(children)

export const Provider = withContext({ 
  store: storePropType,
  fragmentReducers: fragmentReducersPropType,
  renderScheduler: renderSchedulerType,
  fragmentStore: storePropType,
  fragmentId: string,
  services: object
}, ({ store, fragmentStore, fragmentId, fragmentReducers, renderScheduler, services }) =>
   ({ store, fragmentStore, fragmentId, fragmentReducers, renderScheduler, services }))(
  OnlyChild
)
