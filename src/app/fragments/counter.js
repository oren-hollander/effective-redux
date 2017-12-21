import React from 'react'
import { compose } from 'recompose'
import { Button, TextInput } from '../../ui'
import { fragment, mapStateToProps, effect } from '../../effective'
import { interval, combineSubscriptions } from '../../effective/subscriptions'
import { delay, noAction } from '../../util'
import { command, batch } from '../../effective/command'
import { dispatchAction } from '../../effective/commands'
import { createAction, defineAction } from '../../util/actionDefinition'
import { openPanel, setPanelResult } from './panels'
import { bindAction } from '../../util/bindAction'
import { intToString, stringToInt } from '../../util/stringConversion'

const DEC = 'dec'
const dec = defineAction(DEC)

const INC = 'inc'
const inc = defineAction(INC)

const SET_COUNT = 'set-count'
const setCount = defineAction(SET_COUNT, 'count')

const OPEN_EDIT_PANEL = 'open-edit-panel'
const openEditPanel = defineAction(OPEN_EDIT_PANEL)

const REGISTER_PANEL = 'register-panel'
const registerPanel = defineAction(REGISTER_PANEL)

const incAsync = command(async count => {
  await delay(1000)
  return createAction(setCount, count + 1)
})

const CounterEditorView = ({ value }) => 
  <div>
    <div>Counter Editor</div>
    <div><TextInput value={value} onChange={setPanelResult}/></div>
  </div>

const counterEditorReducer = (state = null, action) => state

const CounterEditor = fragment(counterEditorReducer)(CounterEditorView)

const openEditPanelCommand = command(componentClassRegistry => async (fragmentId, count) => {
  return createAction(openPanel, 'Edit Counter', `counterEditor-${fragmentId}`, 
    bindAction(fragmentId, setCount), 
    bindAction(fragmentId, noAction), 
    intToString(count))
}, 'componentClassRegistry')

const registerPanelCommand = command(componentClassRegistry => async fragmentId => {
  componentClassRegistry.registerComponentClass(`counterEditor-${fragmentId}`, CounterEditor)
  return noAction
}, 'componentClassRegistry')

export const reducer = (count = 9, action, { onChange, color, fragmentId }) => {
  switch(action.type){
    case DEC: 
      return effect(count - 1, dispatchAction(createAction(onChange, color)))
    
    case INC: 
      return effect(count, batch(incAsync(count), dispatchAction(createAction(onChange, color))))
  
    case SET_COUNT:
      return stringToInt(action.count)

    case REGISTER_PANEL: 
      return effect(count, registerPanelCommand(fragmentId))

    case OPEN_EDIT_PANEL:
      return effect(count, openEditPanelCommand(fragmentId, count))

    default: 
      return count
  }
}

export const CounterView = ({count, color, fragmentId}) => 
  <div>
    <span>{count}</span>
    <Button color={color} onClick={dec}>-</Button>
    <Button color={color} onClick={inc}>+</Button>
    <Button onClick={openEditPanel}>Edit</Button>
  </div> 

const subscriptions = combineSubscriptions(
  interval(100000, inc),
  dispatch => {
    dispatch(registerPanel)
  }
) 

export const Counter = compose(
  fragment(reducer, subscriptions),
  mapStateToProps(state => ({ count: state }))
)(CounterView)