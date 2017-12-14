import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'


export class Window extends PureComponent {
  constructor(props) {
    super(props)
    this.container = document.createElement('div')
    this.externalWindow = null
  }
  
  componentDidMount() {
    this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200')
    this.externalWindow.document.body.appendChild(this.container)
  }

  componentWillUnmount() {
    this.externalWindow.close()
  }

  render() {
    return createPortal(
      <div>
        <div>
          <button onClick={() => {
            this.props.close()}
          }>Close</button>
        </div>
        <div>
          {this.props.children}
        </div>
      </div>, 
      this.container
    )
  }
}

export class WindowLauncer extends PureComponent {
  constructor(props){
    super(props)
    this.closeWindow = this.closeWindow.bind(this)
    this.state = {
      open: true
    }
  }

  closeWindow() {
    this.setState({open: false})
  }

  render() {
    if(this.state.open)
      return <Window close={this.closeWindow}>{this.props.children}</Window>
    else
      return null
  }
}
