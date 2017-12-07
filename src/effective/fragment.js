import React, { Component } from 'react'
import { string } from 'prop-types'
import { noop, set } from 'lodash/fp'
import { createStore } from 'redux'
import { shallowEqual } from 'recompose'
import { storePropType, renderSchedulerType } from './propTypes'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { idGenerator, breaker } from '../util'
import { renderScheduler } from './hierarchicalRenderScheduler'

export const Fragment = Symbol('Fragment')
export const fragmentAction = fragmentId => set([Fragment], fragmentId)

export const fragment = (fragmentId, View, reducer, subscriptions = noop) => class Comp extends Component {

  static contextTypes = {
    store: storePropType,
    renderScheduler: renderSchedulerType
  }

  static childContextTypes = {
    store: storePropType,
    renderScheduler: renderSchedulerType    
  }

  static nextFragmentId = idGenerator('effective/fragment/')
  
  componentWillMount() {
    this.fragmentPath = `${this.context.fragmentPath}.${Comp.nextFragmentId()}`
    this.store = createStore(reducer, effectiveStoreEnhancer(this.context.store, fragmentId, () => this.props))
    subscriptions(this.store.dispatch)
    
    this.renderScheduler = renderScheduler(this.context.renderScheduler.scheduleChild)
    this.update = breaker(this.forceUpdate.bind(this))

    this.unsubscribe = this.store.subscribe(() => {
      this.update.on()
      this.renderScheduler.scheduleOwn().then(this.update)
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  getChildContext() {
    return {
      store: this.store,
      renderScheduler: this.renderScheduler
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