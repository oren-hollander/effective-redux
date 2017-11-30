import React  from 'react'
import { dispatching } from '../effective/effective'

export const Button = dispatching (
  ({color, onClick, children, dispatch}) => <button style={{borderColor: color, borderWidth: 3}} onClick={() => dispatch(onClick())}>{children}</button>
)