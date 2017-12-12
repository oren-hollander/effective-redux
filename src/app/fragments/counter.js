import React from 'react'
import { Button } from '../../ui'
import { fragment, mapStateToProps, dispatching, effect } from '../../effective'
import { interval } from '../../effective/subscriptions'
import { delay } from '../../util'
import { command, batch } from '../../effective/command'
import { dispatchAction } from '../../effective/commands'

export const COUNTER = Symbol('Counter')

const DEC = 'dec'
const dec = () => ({ type: DEC })

const INC = 'inc'
const inc = () => ({ type: INC })

const SET_COUNT = 'set-count'
const setCount = count => (({ type: SET_COUNT, count }))

const incAsync = async count => {
  await delay(1000)
  return setCount(count + 1)
}

export const reducer = (count = 9, action, { onChange, color }) => {

  switch(action.type){
    case DEC: 
      return effect(count - 1, dispatchAction(onChange(color)))
    
    case INC: 
      return effect(count, batch(command(incAsync)(count), dispatchAction(onChange(color))))
  
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

export const CounterViewWithProps = mapStateToProps(state => ({ count: state }))(CounterView)

const subscriptions = interval(400000, inc())

export const Counter = fragment(COUNTER, CounterViewWithProps, reducer, subscriptions)
