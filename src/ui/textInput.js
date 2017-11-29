import React  from 'react'
import { emitting } from '../effective/effective'

export const TextInput = emitting(
  ({value, onChange, emit}) => {
    return <input type='text' value={value} onChange={e => emit(onChange(e.target.value))}/>
  }
)