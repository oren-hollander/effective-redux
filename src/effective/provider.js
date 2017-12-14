import { Children } from 'react'
import { withContext } from 'recompose'
import { string } from 'prop-types'
import { renderSchedulerType, storePropType, componentClassRegistryPropType, fragmentReducersPropType } from './propTypes'

const OnlyChild = ({ children }) => Children.only(children)

export const Provider = withContext({ 
  store: storePropType,
  fragmentStore: storePropType,
  fragmentId: string,
  componentClassRegistry: componentClassRegistryPropType,
  fragmentReducers: fragmentReducersPropType,
  renderScheduler: renderSchedulerType
}, ({ store, fragmentStore, fragmentId, componentClassRegistry, fragmentReducers, renderScheduler }) => ({ store, fragmentStore, fragmentId, componentClassRegistry, fragmentReducers, renderScheduler }))(
  OnlyChild
)
