import { shape, func, string } from 'prop-types'

export const storePropType = shape({
  subscribe: func.isRequired,
  dispatch: func.isRequired,
  getState: func.isRequired,
  replaceReducer: func.isRequired
})

export const fragmentStorePropType = shape({
  subscribe: func.isRequired,
  dispatch: func.isRequired,
  getState: func.isRequired
})

export const renderSchedulerType = shape({
  scheduleOwn: func.isRequired,
  scheduleChild: func.isRequired
})

export const componentClassRegistryPropType = shape({
  registerComponentClass: func.isRequired,
  unregisterComponentClass: func.isRequired,
  getComponentClass: func.isRequired,
  waitForComponentClass: func.isRequired
})

export const fragmentsPropType = shape({
  fragmentId: string.isRequired,
  store: storePropType.isRequired,
  fragmentStore: storePropType.isRequired,
  componentClassRegistry: componentClassRegistryPropType.isRequired
})

export const fragmentReducersPropType = shape({
  install: func.isRequired,
  uninstall: func.isRequired
})