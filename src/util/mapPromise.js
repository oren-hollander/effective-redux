import { curry } from 'lodash/fp'

export const mapPromise = curry (
  (f, promise) => promise.then(f)
)