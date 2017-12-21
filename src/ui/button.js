import React  from 'react'
import { dispatching } from '../effective/dispatching'

export const Button = dispatching (
  ({color, onClick, children, dispatch}) => 
    <button style={{borderColor: color, borderWidth: 3, margin: '0 2px'}} onClick={() => {
      dispatch(onClick)}
    }>{children}</button>
)