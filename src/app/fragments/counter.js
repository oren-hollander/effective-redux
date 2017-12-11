import React from 'react'
import { Button } from '../../ui'
import { fragment, fragmentAction, mapStateToProps, dispatching } from '../../effective'
import { delay } from '../../util'
import { partial } from 'lodash/fp'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

export const COUNTER = Symbol('Counter')

const counterAction = fragmentAction(COUNTER)

const DEC = 'dec'
const dec = () => counterAction({ type: DEC })

const SET_COUNT = 'set-count'
const setCount = count => counterAction(({ type: SET_COUNT, count }))

const incAsync = count => counterAction(async dispatch => {
  await delay(1000)
  dispatch(setCount(count + 1))
})

const decrease = (onChange, color) => counterAction(async dispatch => {
  dispatch(dec())
  dispatch(onChange(color))
})

const increase = (onChange, color) => counterAction(async (dispatch, getState) => {
  dispatch(incAsync(getState()))
  dispatch(onChange(color))
})

const reducer =  (count = 9, action) => {

  switch(action.type){
    case DEC: 
      return count - 1
  
    case SET_COUNT:
      return action.count
    
    default: 
      return count
  }
}

export const CounterView = dispatching(({count, color, onChange, dispatch}) => 
  <div>
    <span>{count}</span>
    <Button color={color} onClick={() => {
      return decrease(onChange, color)
    }}>-</Button>
    <Button color={color} onClick={partial(increase, [onChange, color])}>+</Button>
  </div> 
)

export const CounterViewWithProps = mapStateToProps(state => ({ count: state }))(CounterView)

const storeCreator = () => createStore(reducer, applyMiddleware(thunk))
export const Counter = fragment(COUNTER, CounterViewWithProps, storeCreator)
