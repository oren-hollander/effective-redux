import { Children } from 'react'
import { withContext } from 'recompose'
import { object, string } from 'prop-types'

const OnlyChild = ({children}) => Children.only(children)

export const Provider = withContext({ 
  store: object,
  scheduleRender: object,
  fragmentPath: string
  }, ({ store, scheduleRender, fragmentPath }) => ({ store, scheduleRender, fragmentPath }))(
  OnlyChild
)
