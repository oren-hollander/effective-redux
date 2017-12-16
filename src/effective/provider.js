import { Children } from 'react'
import { withContext } from 'recompose'
import { string } from 'prop-types'
import { renderSchedulerType, storePropType, fragmentReducersPropType, componentClassRegistryPropType } from './propTypes'

const OnlyChild = ({ children }) => Children.only(children)

export const Provider = withContext({ 
  store: storePropType,
  fragmentReducers: fragmentReducersPropType,
  renderScheduler: renderSchedulerType,
  fragmentStore: storePropType,
  fragmentId: string,
  componentClassRegistry: componentClassRegistryPropType
}, ({ store, fragmentStore, fragmentId, fragmentReducers, renderScheduler, componentClassRegistry }) =>
   ({ store, fragmentStore, fragmentId, fragmentReducers, renderScheduler, componentClassRegistry }))(
  OnlyChild
)
