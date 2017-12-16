import { map, identity } from 'lodash/fp'
import { effect } from '../../effective/effectiveStoreEnhancer'
import { dispatchAction } from '../../effective/commands/dispatchAction'
import { defineAction, createAction } from '../../util/actionDefinition'
import { fragment } from '../../effective/fragment'

const panelsFragmentId = 'panels2'

const OPEN_PANEL = 'open-panel'
export const openPanel = bindAction(panelsFragmentId, defineAction(OPEN_PANEL, 'componentClassId'))

const CLOSE_ALL_PANELS = 'close-all-panels'
export const closeAllPanels = bindAction(panelsFragmentId, defineAction(CLOSE_ALL_PANELS))

const panelsReducer = (panels = [], action, { componentClassRegistry }) => {
  switch (action.type) {
    case OPEN_PANEL:
      return [...panels, action.componentClassId]

    case CLOSE_ALL_PANELS:
      return []

    default:
      return panels
  }
}

const PanelsView = ({ panels }) =>
  <div>
    {
      map(panel => <Panel></Panel>, panels)
    }
  </div>

const PanelsFragment = fragment(panelsReducer)(PanelsView)
