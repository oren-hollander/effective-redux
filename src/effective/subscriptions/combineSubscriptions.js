import { forEach } from 'lodash/fp'
import { invoke } from '../../util/invoke'

export const combineSubscriptions = (...subscriptions) => dispatch => 
  forEach(invoke(dispatch), subscriptions)
