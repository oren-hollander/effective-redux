import { bindAction } from '../../util/bindAction'
import { defineAction } from '../../util/actionDefinition'

const panelsFragmentId = 'panels'

export const OPEN_PANEL = 'open-panel'
export const openPanel = bindAction(panelsFragmentId, defineAction(OPEN_PANEL, 'onOk'))