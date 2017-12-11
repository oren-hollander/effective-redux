import React  from 'react'
import { dispatching } from '../effective/dispatching'

export const Button = dispatching (
  ({color, onClick, children, dispatch}) => 
    <button style={{borderColor: color, borderWidth: 3}} onClick={() => {
      const c = onClick()
      dispatch(c)
    }}>{children}</button>
)