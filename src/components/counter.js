import React from 'react'
import { identity, delay as _delay } from 'lodash/fp'
import { Button } from '../ui/button'
import { fragment, Fragment } from '../effective/fragment'
import { effect } from '../effective/effectiveStoreEnhancer'
import { mapStateToProps } from '../effective/effective'
import { dispatching } from '../effective/effective'

export const COUNTER = Symbol('Counter')

const delay = millis => new Promise(_delay(millis))

const DEC = 'counter/dec'
const dec = () => ({ type: DEC, [Fragment]: COUNTER })

const INC = 'counter/inc'
const inc = () => ({ type: INC, [Fragment]: COUNTER })

const SET_COUNT = 'counter/set-count'
const setCount = count => ({ type: SET_COUNT, [Fragment]: COUNTER, count })

// const incAsync = getState => delay(1000).then(() => setCount(getState() + 1))
const incAsync = getState => setCount(getState() + 1)

export const reducer = getProps => (count = 9, action) => {
  const { onChange, color } = getProps()

  switch(action.type){
    case DEC: 
      return effect(count - 1, onChange(color))
    
    case INC: 
      return effect(count, incAsync)
  
    case SET_COUNT:
      return effect(action.count, onChange('red'))
    
    default: 
      return count
  }
}

export const CounterView = dispatching(({count, color, onChange, dispatch}) => {
  console.log('render counter')
  return <div>
    <span>{count}</span>
    <Button color={color} onClick={dec}>-</Button>
    <Button color={color} onClick={inc}>+</Button>
  </div> 
})

export const CounterViewWithProps = mapStateToProps({count: identity})(CounterView)

const subscriptions = dispatch => setInterval(() => dispatch(inc()), 10000)

export const counterWithStorage = storage => fragment(COUNTER, CounterViewWithProps, reducer, undefined, storage)

export const Counter = fragment(COUNTER, CounterViewWithProps, reducer, undefined)
