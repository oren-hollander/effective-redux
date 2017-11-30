import React from 'react'
import { identity, delay as _delay } from 'lodash/fp'
import { Button } from '../ui/button'
import { component, COMPONENT } from '../effective/component'
import { effect } from '../effective/effectiveStoreEnhancer'
import { mapStateToProps } from '../effective/effective'

export const COUNTER = Symbol('Counter')

const delay = millis => new Promise(_delay(millis))

const DEC = 'counter/dec'
const dec = () => ({ type: DEC, [COMPONENT]: COUNTER })

const INC = 'counter/inc'
const inc = () => ({ type: INC, [COMPONENT]: COUNTER })

const SET_COUNT = 'counter/set-count'
const setCount = count => ({ type: SET_COUNT, [COMPONENT]: COUNTER, count })

const incAsync = getState => {
  const count = getState()
  return delay(1000).then(() => {
    return setCount(count + 1)
  })
}

export const reducer = getProps => (count = 9, action) => {
  const { onChange, color } = getProps()

  switch(action.type){
    case DEC: 
      return effect(count - 1, async () => onChange(color))
    
    case INC: 
      return effect(count, incAsync)
  
    case SET_COUNT:
      return action.count
    
    default: 
      return count
  }
}

export const CounterView = ({count, color, onChange}) => 
  <div>
    <span>{count}</span>
    <Button color={color} onClick={dec}>-</Button>
    <Button color={color} onClick={inc}>+</Button>
  </div>

export const CounterViewWithProps = mapStateToProps({count: identity})(CounterView)

export const counter = component(COUNTER, CounterViewWithProps, reducer, dispatch => {
  setInterval(() => dispatch(inc()), 10000)
})

export const Counter = counter()
