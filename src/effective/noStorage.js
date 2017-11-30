import { noop } from 'lodash/fp'

export const noStorage = {
  getItem: noop,
  setItem: noop
}
