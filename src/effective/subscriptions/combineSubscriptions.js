import { forEach } from 'lodash/fp'
import { invoke } from '../../util'

export const combineSubscriptions = (...subscriptions) => dispatch => 
  forEach(invoke(dispatch), subscriptions)
