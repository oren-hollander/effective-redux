import { identity } from 'lodash/fp'
import { command } from '../command'

export const fetch = command((input, init, successAction, failureAction, mapResponse = identity, mapError = identity) => 
  fetch(input, init)
    .then(response => successAction(mapResponse(response)))
    .catch(error => failureAction(mapError(error)))
)