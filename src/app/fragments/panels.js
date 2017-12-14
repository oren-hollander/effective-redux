import React from 'react'
import { bindAction } from '../../util/bindAction'
import { defineAction } from '../../util/actionDefinition'
import { RegistryComponent } from '../../componentRegistry/registryComponent'
import { Button } from '../../ui/button'
import { fragment, mapStateToProps } from '../../effective'
import { pick, identity, isUndefined, noop } from 'lodash/fp'

const panelsFragmentId = 'panels'

const OPEN_PANEL = 'open-panel'
export const openPanel = bindAction(panelsFragmentId, defineAction(OPEN_PANEL, 'title', 'contentClassId', 'onOk', 'onCancel'))

const reducer = (state = {}, action) => {
  switch(action.type){
    case OPEN_PANEL: 
      return pick(['title', 'contentClassId', 'onOk', 'onCancel'], action)

    default: 
      return state
  }
}

export const PanelView = ({ title, contentClassId, onOk, onCancel }) => {
  if(isUndefined(contentClassId))
    return null
  
  return <div style={{border: '2px solid red'}}>
    <div>{title}</div>
    <RegistryComponent componentClassId={contentClassId} />
    <div>
      <Button onClick={onOk}>OK</Button>
      <Button onClick={onCancel}>Cancel</Button>
    </div>
  </div>
}

export const PanelViewWithProps = mapStateToProps(identity)(PanelView)
export const Panel = fragment(PanelViewWithProps, reducer, noop, panelsFragmentId)
