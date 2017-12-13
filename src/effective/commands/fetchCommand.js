import { identity } from 'lodash/fp'
import { command } from '../command'
import { createAction } from '../../util/actionDefinition'

export const fetch = command((input, init, successAction, failureAction, mapResponse = identity, mapError = identity) => 
  fetch(input, init)
    .then(response => createAction(successAction, mapResponse(response)))
    .catch(error => createAction(failureAction, mapError(error)))
)