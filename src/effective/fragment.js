import React, { Component } from 'react'
import { object, func, string } from 'prop-types'
import { noop } from 'lodash/fp'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { idGenerator } from '../util/idGenerator'
import { shallowEqual } from 'recompose'

export const Fragment = Symbol('Fragment')

export const fragment = (fragmentId, View, reducer, subscriptions = noop) => class Comp extends Component {

  static contextTypes = {
    store: object,
    scheduleRender: func,
    fragmentPath: string
  }

  static childContextTypes = {
    store: object, 
    fragmentPath: string
  }

  static nextFragmentId = idGenerator('effective/fragment/')
  
  componentWillMount() {
    this.fragmentPath = `${this.context.fragmentPath}.${Comp.nextFragmentId()}`
    this.store = createStore(reducer, effectiveStoreEnhancer(this.context.store, fragmentId, () => this.props))
    subscriptions(this.store.dispatch)
    const render = this.forceUpdate.bind(this)
    this.unsubscribe = this.store.subscribe(() => {
      this.renderNeeded = true
      this.context.scheduleRender(this.fragmentPath, render)
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  getChildContext() {
    return {
      store: this.store,
      fragmentPath: this.fragmentPath
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.renderNeeded || !shallowEqual(nextProps, this.props) 
  }

  render(){
    this.renderNeeded = false
    return <View {...this.props}/>
  }
}