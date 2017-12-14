import { defaultTo } from 'lodash/fp'

export const intToString = int => Number(int).toString()
export const stringToInt = str => defaultTo(0, Number.parseInt(str, 10))
