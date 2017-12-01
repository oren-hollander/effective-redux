import React, { Component } from 'react'
import { dispatching } from '../effective/effective'

export const TextInput = dispatching (
  ({value, onChange, dispatch}) => {
    return <input type='text' value={value} onChange={e => dispatch(onChange(e.target.value))}/>
  }
)

// const stringToInt = str => {
//   const num = Number.parseInt(str, 10)
//   return Number.isNaN(num) ? 0 : num
// }

class TextInput22 extends Component {
  render() {
    return <input type='text' value={this.props.value} onChange={e => this.props.dispatch(this.props.onChange(e.target.value))}/>
  }
}

export const TextInput2 = dispatching(TextInput22)
