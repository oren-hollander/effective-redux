import React from 'react'
import { identity, delay as _delay } from 'lodash/fp'
import { Button } from '../ui/button'
import { fragment, fragmentAction } from '../effective/fragment'
import { effect } from '../effective/effectiveStoreEnhancer'
import { mapStateToProps } from '../effective/effective'
import { dispatching } from '../effective/effective'
import { interval } from '../effective/subscriptions/intervalSubscription'

export const COUNTER = Symbol('Counter')

const delay = millis => new Promise(_delay(millis))
const counterAction = fragmentAction(COUNTER)

const DEC = 'counter/dec'
const dec = () => counterAction({ type: DEC })

const INC = 'counter/inc'
const inc = () => counterAction({ type: INC })

const SET_COUNT = 'counter/set-count'
const setCount = count => counterAction(({ type: SET_COUNT, count }))

const incAsync = async getState => {
  await delay(1000)
  return setCount(getState() + 1)
}

export const reducer =  (count = 9, action, {onChange, color}) => {

  switch(action.type){
    case DEC: 
      return effect(count - 1, onChange(color))
    
    case INC: 
      return effect(count, [incAsync, onChange(color)])
  
    case SET_COUNT:
      return action.count
    
    default: 
      return count
  }
}

export const CounterView = dispatching(({count, color, dispatch}) => 
  <div>
    <span>{count}</span>
    <Button color={color} onClick={dec}>-</Button>
    <Button color={color} onClick={inc}>+</Button>
  </div> 
)

export const CounterViewWithProps = mapStateToProps({count: identity})(CounterView)

const subscriptions = interval(30000, inc)

export const Counter = fragment(COUNTER, CounterViewWithProps, reducer, subscriptions)
