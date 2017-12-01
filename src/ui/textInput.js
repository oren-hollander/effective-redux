import React, { Component } from 'react'
import { dispatching } from '../effective/effective'

export const TextInput = dispatching(class extends Component {
  constructor(props) {
    super(props)
    this.state = { value: props.value }
  }

  componentWillReceiveProps(nextProps){
    this.setState({ value: nextProps.value })
  }

  render() {
    return <input type='text' 
      value={this.state.value} 
      onChange={e => {
        this.setState({value: e.target.value})
        this.props.dispatch(this.props.onChange(e.target.value))
      }}
    />
  }
})

