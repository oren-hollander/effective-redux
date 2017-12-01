import { identity } from 'lodash/fp'

export const fetch = (input, init, successAction, failureAction, mapResponse = identity, mapError = identity) => 
  fetch(input, init)
    .then(response => successAction(mapResponse(response)))
    .catch(error => failureAction(mapError(error)))