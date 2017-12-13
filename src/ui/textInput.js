import React, { Component } from 'react'
import { dispatching } from '../effective/dispatching'
import { string, func } from 'prop-types'
import { actionPropType, createAction } from '../util/actionDefinition'

export const TextInput = dispatching(class TextInput extends Component {
  static propTypes = {
    value: string,
    dispatch: func,
    onChange: actionPropType 
  }

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
        this.props.dispatch(createAction(this.props.onChange, e.target.value))
      }}
    />
  }
})

