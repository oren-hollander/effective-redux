import { Children } from 'react'
import { withContext } from 'recompose'
import { string, object } from 'prop-types'
import { renderSchedulerType, storePropType, componentClassRegistryPropType, fragmentReducersPropType } from './propTypes'

const OnlyChild = ({ children }) => Children.only(children)

export const Provider = withContext({ 
  store: storePropType,
  componentClassRegistry: componentClassRegistryPropType,
  fragmentReducers: fragmentReducersPropType,
  renderScheduler: renderSchedulerType,
  fragmentStore: storePropType,
  fragmentId: string,
  services: object
}, ({ store, fragmentStore, fragmentId, componentClassRegistry, fragmentReducers, renderScheduler, services }) =>
   ({ store, fragmentStore, fragmentId, componentClassRegistry, fragmentReducers, renderScheduler, services }))(
  OnlyChild
)
