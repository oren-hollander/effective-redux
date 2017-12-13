import React, { PureComponent } from 'react'
import { func, symbol } from 'prop-types'
import { noop, set } from 'lodash/fp'
import { createStore } from 'redux'
import { mapValues } from 'lodash/fp'
import { renderSchedulerType } from './propTypes'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { idGenerator, breaker } from '../util'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { tag, isTaggedWith, isTagged } from '../util'

export const Fragment = Symbol('Fragment')
export const fragmentAction = fragmentId => set([Fragment], fragmentId)

export const fragment = (fragmentId, View, reducer, subscriptions = noop) => class Comp extends PureComponent {

  static contextTypes = {
    fragmentId: symbol,    
    renderScheduler: renderSchedulerType,
    dispatch: func,
    getState: func
  }

  static childContextTypes = {
    fragmentId: symbol,    
    renderScheduler: renderSchedulerType,
    dispatch: func,
    getState: func
  }

  static nextFragmentId = idGenerator('effective/fragment/')
  
  componentWillMount() {
    this.fragmentInstanceId = Symbol(fragmentId.toString())
    this.dispatch = action => { 
      return isTaggedWith(this.fragmentInstanceId, action) || !isTagged(action)
      ? this.store.dispatch(action) 
      : this.context.dispatch(action)    
    }

    this.store = createStore(reducer, effectiveStoreEnhancer(this.dispatch, () => this.tagActionProps(this.props)))
    subscriptions(this.dispatch)
    
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
      fragmentId: this.fragmentInstanceId,
      dispatch: this.dispatch,
      getState: this.store.getState,
      renderScheduler: this.renderScheduler
    }
  }

  tagActionProps(props) {
    return mapValues(tag(this.context.fragmentId), props)
  }

  render(){
    this.update.off()
    return <View { ...this.tagActionProps(this.props) } fragmentInstanceId={this.fragmentInstanceId}/>
  }
}