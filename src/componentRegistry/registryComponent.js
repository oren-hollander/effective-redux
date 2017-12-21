import React, { PureComponent } from 'react'
import { string } from 'prop-types'
import { isUndefined, constant, omit } from 'lodash/fp'
import { componentClassRegistryPropType } from './componentClassRegistry'

export class RegistryComponent extends PureComponent {
  static propTypes = { 
    componentClassId: string.isRequired 
  }

  static contextTypes = {
    services: componentClassRegistryPropType
  }

  constructor(props) {
    super(props)
    this.state = { 
      ComponentClass: constant(null)
    }
  }

  componentWillMount() {
    const ComponentClass = this.context.services.componentClassRegistry.getComponentClass(this.props.componentClassId)
    if(isUndefined(ComponentClass)){
      this.context.services.componentClassRegistry.waitForComponentClass(this.props.componentClassId)
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