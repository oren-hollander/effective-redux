import React, { Component } from 'react'
import { string } from 'prop-types'
import { noop, compose, set } from 'lodash/fp'
import { createStore } from 'redux'
import { shallowEqual } from 'recompose'
import { storePropType, renderSchedulerType } from './propTypes'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { idGenerator, breaker, liftArrow } from '../util'

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
    
    this.update = breaker(this.forceUpdate.bind(this))

    this.unsubscribe = this.store.subscribe(() => {
      this.update.on()
      this.context.renderScheduler(this.fragmentPath, this.update)
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
    return !shallowEqual(nextProps, this.props) 
  }

  render(){
    this.update.off()
    return <View {...this.props}/>
  }
}