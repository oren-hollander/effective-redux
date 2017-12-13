import { tagAction } from '../../util/tagAction'
import { defineAction } from '../../util/parametricAction'

const panelsFragmentId = 'panels'

export const OPEN_PANEL = 'open-panel'
export const openPanel = tagAction(panelsFragmentId, defineAction(OPEN_PANEL, 'onOk'))