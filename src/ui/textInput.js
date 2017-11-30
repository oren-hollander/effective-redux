import React  from 'react'
import { dispatching } from '../effective/effective'

export const TextInput = dispatching (
  ({value, onChange, dispatch}) => {
    return <input type='text' value={value} onChange={e => dispatch(onChange(e.target.value))}/>
  }
)