import { delay as _delay } from 'lodash/fp'

export const delay = millis => new Promise(_delay(millis))
