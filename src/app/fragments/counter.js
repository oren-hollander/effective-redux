import React from 'react'
import { isUndefined } from 'lodash/fp' 
import { Button, TextInput } from '../../ui'
import { fragment, mapStateToProps, effect } from '../../effective'
import { interval } from '../../effective/subscriptions'
import { delay, noAction } from '../../util'
import { command, batch } from '../../effective/command'
import { dispatchAction } from '../../effective/commands'
import { createAction, defineAction } from '../../util/actionDefinition'
import { openPanel, setPanelResult } from './panels'
import { bindAction } from '../../util/bindAction'
import { intToString } from '../../util/stringConversion'

const DEC = 'dec'
const dec = defineAction(DEC)

const INC = 'inc'
const inc = defineAction(INC)

const SET_COUNT = 'set-count'
const setCount = defineAction(SET_COUNT, 'count')

const OPEN_EDIT_PANEL = 'open-edit-panel'
const openEditPanel = defineAction(OPEN_EDIT_PANEL)

const incAsync = async count => {
  await delay(1000)
  return createAction(setCount, count + 1)
}

const counterEditorReducer = (state, action) => state

const CounterEditorView = ({ count }) => 
  <div>
    <div>Counter Editor</div>
    <div><TextInput value={count} onChange={setPanelResult}/></div>
  </div>

const CounterEditor = fragment(CounterEditorView, counterEditorReducer)

const openEditPanelCommand = command(async (fragmentId, componentClassRegistry, count) => {
  if(isUndefined(componentClassRegistry.getComponentClass(fragmentId)))
    componentClassRegistry.registerComponentClass('counterEditor', CounterEditor)
  return createAction(openPanel, 'Edit Counter', 'counterEditor', bindAction(fragmentId, setCount), bindAction(fragmentId, noAction), { count: intToString(count) })
})

export const reducer = (count = 9, action, { onChange, color, fragmentId, componentClassRegistry }) => {

  switch(action.type){
    case DEC: 
      return effect(count - 1, dispatchAction(createAction(onChange, color)))
    
    case INC: 
      return effect(count, batch(command(incAsync)(count), dispatchAction(createAction(onChange, color))))
  
    case SET_COUNT:
      return action.count

    case OPEN_EDIT_PANEL:
      return effect(count, openEditPanelCommand(fragmentId, componentClassRegistry, count))

    default: 
      return count
  }
}

export const CounterView = ({count, color}) => {
  return <div>
    <span>{count}</span>
    <Button color={color} onClick={dec}>-</Button>
    <Button color={color} onClick={inc}>+</Button>
    <Button onClick={openEditPanel}>Edit</Button>
  </div> 
}

export const CounterViewWithProps = mapStateToProps(state => ({ count: state }))(CounterView)

const subscriptions = interval(100000, inc)

export const Counter = fragment(CounterViewWithProps, reducer, subscriptions)
