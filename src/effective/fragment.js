import React, { PureComponent } from 'react'
import { func } from 'prop-types'
import { noop, set } from 'lodash/fp'
import { createStore } from 'redux'
import { renderSchedulerType } from './propTypes'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { idGenerator, breaker } from '../util'
import { renderScheduler } from './hierarchicalRenderScheduler'

export const Fragment = Symbol('Fragment')
export const fragmentAction = fragmentId => set([Fragment], fragmentId)

export const fragment = (fragmentId, View, reducer, subscriptions = noop) => class Comp extends PureComponent {

  static contextTypes = {
    renderScheduler: renderSchedulerType,
    dispatch: func,
    getState: func
  }

  static childContextTypes = {
    renderScheduler: renderSchedulerType,
    dispatch: func,
    getState: func
  }

  static nextFragmentId = idGenerator('effective/fragment/')
  
  componentWillMount() {
    this.dispatch = action => action[Fragment] === fragmentId
      ? this.store.dispatch(action) 
      : this.context.dispatch(action)    

    this.store = createStore(reducer, effectiveStoreEnhancer(this.dispatch, () => this.props))
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
      dispatch: this.dispatch,
      getState: this.store.getState,
      renderScheduler: this.renderScheduler
    }
  }

  render(){
    this.update.off()
    return <View {...this.props}/>
  }
}