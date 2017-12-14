import React from 'react'
import { Button } from '../../ui'
import { fragment, mapStateToProps, dispatching, effect } from '../../effective'
import { interval } from '../../effective/subscriptions'
import { delay, noAction } from '../../util'
import { command, batch } from '../../effective/command'
import { dispatchAction } from '../../effective/commands'
import { createAction, defineAction } from '../../util/actionDefinition'
import { openPanel } from './panels'
import { bindAction } from '../../util/bindAction'

const DEC = 'dec'
const dec = defineAction(DEC)

const INC = 'inc'
const inc = defineAction(INC)

const SET_COUNT = 'set-count'
const setCount = defineAction(SET_COUNT, 'count')

const incAsync = async count => {
  await delay(1000)
  return createAction(setCount, count + 1)
}

export const reducer = (count = 9, action, { onChange, color }) => {

  switch(action.type){
    case DEC: 
      return effect(count - 1, dispatchAction(createAction(onChange, color)))
    
    case INC: 
      return effect(count, batch(command(incAsync)(count), dispatchAction(createAction(onChange, color))))
  
    case SET_COUNT:
      return action.count
    
    default: 
      return count
  }
}

const createOpenPanelAction = (fragmentId) => createAction(openPanel, 'Edit Counter', 'edit panel class id', bindAction(fragmentId, setCount), bindAction(fragmentId, noAction))

export const CounterView = dispatching(({fragmentId, count, color, dispatch}) => 
  <div>
    <span>{count}</span>
    <Button color={color} onClick={dec}>-</Button>
    <Button color={color} onClick={inc}>+</Button>
    <Button onClick={createOpenPanelAction(fragmentId)}>Edit</Button>
  </div> 
)

export const CounterViewWithProps = mapStateToProps(state => ({ count: state }))(CounterView)

const subscriptions = interval(100000, inc)

export const Counter = fragment(CounterViewWithProps, reducer, subscriptions)
