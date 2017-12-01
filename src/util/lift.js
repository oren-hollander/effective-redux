import { curry, isArray, isObject, isFunction, constant } from 'lodash/fp'

export const lift = curry((detect, ctor, value) => detect(value) ? value : ctor(value))

export const liftArray = lift(isArray, value => [value])
export const liftObject = key => lift(isObject, value => ({key: value}))

export const liftPromise = lift(constant(false), Promise.resolve.bind(Promise))
export const liftArrow = lift(isFunction, value => () => value)

const isInstanceOf = curry((Class, value) => value instanceof Class)
const createInstance = curry((Class, value) => new Class(value))

export const liftClass = Class => lift(isInstanceOf(Class), createInstance(Class))