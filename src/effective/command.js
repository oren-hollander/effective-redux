import { map, get, isEmpty } from 'lodash/fp'
import { flip } from '../util/flip'

export const command = (commandFunction, ...serviceNames) => (...args) => ({ commandFunction, serviceNames, args })

export const execute = services => ({ commandFunction, serviceNames, args }) => 
  isEmpty(serviceNames) 
    ? commandFunction(...args)
    : commandFunction(...map(flip(get)(services), serviceNames))(...args)

export const batch = (...commands) => commands