import { shape, func } from 'prop-types'

export const storePropType = shape({
  subscribe: func.isRequired,
  dispatch: func.isRequired,
  getState: func.isRequired,
  replaceReducer: func.isRequired
})

export const renderSchedulerType = shape({
  scheduleOwn: func.isRequired,
  scheduleChild: func.isRequired
})
