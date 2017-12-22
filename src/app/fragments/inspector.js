import { map, identity } from 'lodash/fp'
import { effect } from '../../effective/effectiveStoreEnhancer'
import { dispatchAction } from '../../effective/commands/dispatchAction'
import { defineAction, createAction } from '../../util/actionDefinition'
import { fragment } from '../../effective/fragment'

const inspectorsFragmentId = 'inspectors'

const OPEN_INSPECTOR = 'open-inspector'
export const openPanel = bindAction(inspectorsFragmentId, defineAction(OPEN_INSPECTOR, 'componentClassId'))

const CLOSE_ALL_INSPSCTORS = 'close-all-inspectors'
export const closeAllInspectors = bindAction(inspectorsFragmentId, defineAction(CLOSE_ALL_INSPSCTORS))

const inspectorsReducer = (inspectors = [], action) => {
  switch (action.type) {
    case OPEN_INSPECTOR:
      return [...inspectors, action.componentClassId]

    case CLOSE_ALL_INSPSCTORS:
      return []

    default:
      return inspectors
  }
}

const InspectorsView = ({}) =>
  <div>
    Inspectors
    {
//      map(panel => <Panel></Panel>, panels)
    }
  </div>

const InspectorsFragment = fragment(inspectorsReducer)(InspectorsView)
