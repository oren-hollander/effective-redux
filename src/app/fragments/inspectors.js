import React from 'react'
import { map, isEmpty, compose, uniqBy, sortBy, reject, concat, flow, get, eq, find, isUndefined } from 'lodash/fp'
import { defineAction, createAction } from '../../util/actionDefinition'
import { fragment } from '../../effective/fragment'
import { bindAction } from '../../util/bindAction'
import { RegistryComponent } from '../../componentRegistry/registryComponent'
import { Button } from '../../ui/button'
import { mapStateToProps } from '../../effective/mapStateToProps'
import { flip } from '../../util/flip'

export const inspectorsFragmentId = 'inspectors'

const OPEN_INSPECTOR = 'open-inspector'
export const openInspector = bindAction(inspectorsFragmentId, defineAction(OPEN_INSPECTOR, 'componentClassId', 'name', 'value', 'onUpdate'))

const UPDATE_INSPECTOR = 'update-inspector'
export const updateInspector = bindAction(inspectorsFragmentId, defineAction(UPDATE_INSPECTOR, 'componentClassId', 'value'))

const CLOSE_INSPSCTOR = 'close-inspector'
const closeInspector = defineAction(CLOSE_INSPSCTOR, 'componentClassId')

const CLOSE_ALL_INSPSCTORS = 'close-all-inspectors'
export const closeAllInspectors = bindAction(inspectorsFragmentId, defineAction(CLOSE_ALL_INSPSCTORS))

const inspectorsReducer = (inspectors = [], action) => {
  switch (action.type) {
    case OPEN_INSPECTOR:
      return flow(
        uniqBy('componentClassId'),
        sortBy('componentClassId')
      )( 
        [...inspectors, { componentClassId: action.componentClassId, name: action.name, value: action.value, onUpdate: action.onUpdate }]
      )

    case UPDATE_INSPECTOR:
      const inspector = find(inspector => inspector.componentClassId === action.componentClassId, inspectors)
      if(isUndefined(inspector))
        return inspectors
      else 
        return flow(
          reject(inspector => inspector.componentClassId === action.componentClassId),
          flip(concat)({ ...inspector, value: action.value }),
          sortBy('componentClassId')
        )(inspectors)

    case CLOSE_INSPSCTOR:
      return reject(flow(get('componentClassId'), eq(action.componentClassId)), inspectors)
    
    case CLOSE_ALL_INSPSCTORS:
      return []

    default:
      return inspectors
  }
}

const Inspector = ({name, componentClassId, value, onUpdate}) => 
  <div style={{ backgroundColor: 'gray', padding: '5px', margin: '5px 0' }}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'sans-serif', color: 'white', paddingBottom: '4px'}}>
      <div style={{ justifySelf: 'flex-start' }}>{name}</div>
      <Button color='pink' onClick={createAction(closeInspector, componentClassId)}>X</Button>
    </div>
    <div style={{ backgroundColor: 'white', padding: '5px'}}>
      <RegistryComponent componentClassId={componentClassId} onUpdate={onUpdate} value={value}/>
    </div>
  </div>

const renderInspector = ({ componentClassId, name, value, onUpdate }) => {
  return <Inspector key={componentClassId} name={name} value={value} componentClassId={componentClassId} onUpdate={onUpdate}/>
}

const InspectorsView = ({ inspectors }) =>
  <div style={{padding: '5px', backgroundColor: 'lightgray', height: '100%'}}>
    <div style={{textAlign: 'center', fontSize: '18px', fontFamily: 'sans-serif'}}>
      Inspectors
    </div>
    <div>
      <Button color='gray' disabled={isEmpty(inspectors)} onClick={closeAllInspectors}>Close All</Button>
    </div>
    {
     map(renderInspector, inspectors)
    }
  </div>

export const Inspectors = compose(
    fragment(inspectorsReducer),
    mapStateToProps(inspectors => ({ inspectors }))
)(InspectorsView)
