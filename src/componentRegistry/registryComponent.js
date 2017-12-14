import React, { Component } from 'react'
import { string } from 'prop-types'
import { componentClassRegistryPropType } from '../effective/propTypes'
import { isUndefined, constant, omit } from 'lodash/fp'

export class RegistryComponent extends Component {
  static propTypes = { componentClassId: string.isRequired }

  static contextTypes = {
    componentClassRegistry: componentClassRegistryPropType
  }

  constructor(props) {
    super(props)
    this.state = { 
      ComponentClass: constant(null)
    }
  }

  componentWillMount() {
    const ComponentClass = this.context.componentClassRegistry.getComponentClass(this.props.componentClassId)
    if(isUndefined(ComponentClass)){
      this.context.componentClassRegistry.waitForComponentClass(this.props.componentClassId)
        .then(ComponentClass => {
          this.setState({ ComponentClass })
          this.forceUpdate()
        })
    }
    else {
      this.setState({ ComponentClass })
    }
  }

  render() {
    const props = omit('componentClassId', this.props)
    return <this.state.ComponentClass { ...props }/>
  }
}