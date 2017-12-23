import React from 'react'
import { compose } from 'recompose'
import { Button } from '../../ui/button'
import { TextInput } from '../../ui/textInput'
import { fragment } from '../../effective/fragment'
import { mapStateToProps } from '../../effective/mapStateToProps'
import { effect } from '../../effective/effect'
import { interval } from '../../effective/subscriptions/interval'
import { combineSubscriptions } from '../../effective/subscriptions/combineSubscriptions'
import { delay } from '../../util/delay'
import { noAction } from '../../util/noAction'
import { command, batch } from '../../effective/command'
import { dispatchAction } from '../../effective/commands/dispatchAction'
import { createAction, defineAction } from '../../util/actionDefinition'
import { openPanel } from './panels'
import { openInspector, updateInspector } from './inspectors'
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

const CounterEditorView = ({ value, onUpdate }) => 
  <div>
    <div>Enter counter value:</div>
    <div><TextInput value={value} onChange={onUpdate}/></div>
  </div>

const counterEditorReducer = (state = null, action) => state

const CounterEditor = fragment(counterEditorReducer)(CounterEditorView)

const counterEditorComponentClassId = fragmentId => `counterEditor-${fragmentId}`

const registerCounterEditorCommand = command(componentClassRegistry => async fragmentId => {
  componentClassRegistry.registerComponentClass(counterEditorComponentClassId(fragmentId), CounterEditor)
  return noAction
}, 'componentClassRegistry')

export const reducer = (count = 9, action, { onChange, color, fragmentId }) => {
  switch(action.type){
    case DEC: 
      return effect(count - 1, batch(
        dispatchAction(createAction(onChange, color)), 
        dispatchAction(createAction(updateInspector, counterEditorComponentClassId(fragmentId), intToString(count - 1)))
      ))
    
    case INC: 
      return effect(count, batch(
        incAsync(count), 
        dispatchAction(createAction(onChange, color))
      ))
  
    case SET_COUNT:
      return effect(
        stringToInt(action.count), 
        dispatchAction(createAction(updateInspector, counterEditorComponentClassId(fragmentId), intToString(action.count)))
      )

    case REGISTER_PANEL: 
      return effect(
        count, 
        registerCounterEditorCommand(fragmentId)
      )

    case OPEN_EDIT_PANEL:
      return effect(count, dispatchAction(
          createAction(openPanel, 
            'Edit Counter', 
            counterEditorComponentClassId(fragmentId),
            bindAction(fragmentId, setCount), 
            bindAction(fragmentId, noAction), 
            intToString(count)
          )
        ))

    default: 
      return effect(
        count,
        dispatchAction(createAction(updateInspector, counterEditorComponentClassId(fragmentId), intToString(count)))        
      )
  }
}

export const CounterView = ({name, count, color, fragmentId}) => 
  <div style={{border: `3px solid ${color}`, padding: '10px', margin: '10px'}}>
    <div style={{marginBottom: '6px'}}>
      {name}
    </div>
    <div>
    <Button color={color} onClick={dec}>-</Button>
    <span style={{margin: '0 10px'}}>{count}</span>
    <Button color={color} onClick={inc}>+</Button>
    </div>
    <div style={{marginTop: '6px'}}>
      <Button color='gray' onClick={openEditPanel}>Edit</Button>
      <Button color='gray' onClick={createAction(openInspector, counterEditorComponentClassId(fragmentId), name, intToString(count), bindAction(fragmentId, setCount))}>Inspect</Button>
    </div>
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