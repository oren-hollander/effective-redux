import React  from 'react'
import { emitting } from '../effective/effective'

export const Button = emitting(
  ({color, onClick, children, emit}) => <button style={{borderColor: color, borderWidth: 3}} onClick={() => emit(onClick())}>{children}</button>
)