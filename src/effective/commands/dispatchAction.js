import { command } from '../command'

export const dispatchAction = command(Promise.resolve.bind(Promise))