import React, { Component } from 'react'
import { string } from 'prop-types'
import { noop, compose, set } from 'lodash/fp'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { idGenerator } from '../util/idGenerator'
import { shallowEqual } from 'recompose'
import { liftArrow } from '../util/lift'
import { storePropType, renderSchedulerType } from './propTypes'

export const Fragment = Symbol('Fragment')
export const fragmentAction = fragmentId => action => compose(set([Fragment], fragmentId), liftArrow(action)) 

export const fragment = (fragmentId, View, reducer, subscriptions = noop) => class Comp extends Component {

  static contextTypes = {
    store: storePropType,
    renderScheduler: renderSchedulerType,
    fragmentPath: string
  }

  static childContextTypes = {
    store: storePropType, 
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
      this.context.renderScheduler.schedule(this.fragmentPath, render)
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
    this.context.renderScheduler.cancel(this.fragmentPath)
    return <View {...this.props}/>
  }
}