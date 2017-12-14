import React from 'react'
import { bindAction } from '../../util/bindAction'
import { defineAction, createAction } from '../../util/actionDefinition'
import { RegistryComponent } from '../../componentRegistry/registryComponent'
import { Button } from '../../ui/button'
import { fragment, mapStateToProps } from '../../effective'
import { identity, isNil, noop } from 'lodash/fp'
import { effect } from '../../effective/effectiveStoreEnhancer'
import { dispatchAction } from '../../effective/commands/dispatchAction'

const panelsFragmentId = 'panels'

const OPEN_PANEL = 'open-panel'
export const openPanel = bindAction(panelsFragmentId, defineAction(OPEN_PANEL, 'title', 'contentClassId', 'onOk', 'onCancel', 'value'))

const CLOSE_PANEL_CANCEL = 'close-panel-cancel'
export const closePanelCancel = bindAction(panelsFragmentId, defineAction(CLOSE_PANEL_CANCEL))

const CLOSE_PANEL_OK = 'close-panel-ok'
export const closePanelOk = bindAction(panelsFragmentId, defineAction(CLOSE_PANEL_OK))

const SET_PANEL_RESULT = 'set-panel-result'
export const setPanelResult = bindAction(panelsFragmentId, defineAction(SET_PANEL_RESULT, 'result'))

const panelState = (title = null, contentClassId = null, onOk = null, onCancel = null, value = null) => ({ title, contentClassId, onOk, onCancel, value })

const reducer = (state = panelState(), action) => {
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
  
  return <div style={{border: '2px solid red'}}>
    <div>{title}</div>
    <RegistryComponent componentClassId={contentClassId} setPanelResult={setPanelResult} value={value}/>
    <div>
      <Button onClick={closePanelOk}>OK</Button>
      <Button onClick={closePanelCancel}>Cancel</Button>
    </div>
  </div>
}

export const PanelViewWithProps = mapStateToProps(identity)(PanelView)
export const Panel = fragment(PanelViewWithProps, reducer, noop, panelsFragmentId)
