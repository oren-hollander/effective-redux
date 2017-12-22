import React, { Fragment } from 'react'
import { compose } from 'recompose'
import { bindAction } from '../../util/bindAction'
import { defineAction, createAction } from '../../util/actionDefinition'
import { RegistryComponent } from '../../componentRegistry/registryComponent'
import { Button } from '../../ui/button'
import { fragment } from '../../effective/fragment'
import { mapStateToProps } from '../../effective/mapStateToProps'
import { identity, isNil, noop } from 'lodash/fp'
import { effect } from '../../effective/effect'
import { dispatchAction } from '../../effective/commands/dispatchAction'

export const panelsFragmentId = 'panels'

const OPEN_PANEL = 'open-panel'
export const openPanel = bindAction(panelsFragmentId, defineAction(OPEN_PANEL, 'title', 'contentClassId', 'onOk', 'onCancel', 'value'))

const CLOSE_PANEL_CANCEL = 'close-panel-cancel'
export const closePanelCancel = bindAction(panelsFragmentId, defineAction(CLOSE_PANEL_CANCEL))

const CLOSE_PANEL_OK = 'close-panel-ok'
export const closePanelOk = bindAction(panelsFragmentId, defineAction(CLOSE_PANEL_OK))

const SET_PANEL_RESULT = 'set-panel-result'
export const setPanelResult = bindAction(panelsFragmentId, defineAction(SET_PANEL_RESULT, 'result'))

const panelState = (title = null, contentClassId = null, onOk = null, onCancel = null, value = null) => ({ title, contentClassId, onOk, onCancel, value })

const reducer = (state, action) => {
  state = state || panelState()
  switch(action.type){
    case OPEN_PANEL: 
      return panelState(action.title, action.contentClassId, action.onOk, action.onCancel, action.value)

    case CLOSE_PANEL_CANCEL:
      return effect(panelState(), dispatchAction(state.onCancel))

    case CLOSE_PANEL_OK:
    return effect(panelState(), dispatchAction(createAction(state.onOk, state.value)))

    case SET_PANEL_RESULT:
      return { ...state, value: action.result }

    default: 
      return state
  }
}

export const PanelView = ({ title, contentClassId, onOk, onCancel, value }) => {
  if(isNil(contentClassId))
    return null
 
  return (
    <Fragment>
      <div style={{backgroundColor: 'lightgray', position: 'absolute', opacity: '0.5', margin: '0', padding: '0', left: '0', top: '0', height: '100%', width: '100%'}}/>
      <div style={{border: '4px solid gray', position: 'absolute', width: '400px', height: '200px', left: '40%', top: '25%', backgroundColor: 'white'}}>
        <div style={{backgroundColor: 'gray', color: 'white', padding: '2px'}}>{title}</div>
        <div style={{padding: '5px'}}>
          <RegistryComponent componentClassId={contentClassId} setPanelResult={setPanelResult} value={value}/>
          <div style={{marginTop: '10px'}}>
            <Button color='green' onClick={closePanelOk}>OK</Button>
            <Button color='red' onClick={closePanelCancel}>Cancel</Button>
          </div>      
        </div>
      </div>
    </Fragment>
  )
}

export const Panel = compose(
  fragment(reducer, noop, panelsFragmentId),
  mapStateToProps(identity)
)(PanelView)
