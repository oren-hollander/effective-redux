import React, { PureComponent } from 'react'
import { func, string } from 'prop-types'
import { noop } from 'lodash/fp'
import { createStore } from 'redux'
import { mapValues } from 'lodash/fp'
import { renderSchedulerType } from './propTypes'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { idGenerator, breaker } from '../util'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { bindAction, isBoundTo, isBound } from '../util/bindAction'

export const fragment = (View, reducer, subscriptions = noop) => class Comp extends PureComponent {

  static contextTypes = {
    fragmentId: string,    
    renderScheduler: renderSchedulerType,
    dispatch: func,
    getState: func
  }

  static childContextTypes = {
    fragmentId: string,    
    renderScheduler: renderSchedulerType,
    dispatch: func,
    getState: func
  }

  static fragmentIdGenerator = idGenerator('fragment-')
  
  componentWillMount() {
    this.fragmentId = Comp.fragmentIdGenerator()
    this.dispatch = action => { 
      return isBoundTo(this.fragmentId, action) || !isBound(action)
      ? this.store.dispatch(action) 
      : this.context.dispatch(action)    
    }

    this.store = createStore(reducer, effectiveStoreEnhancer(this.dispatch, () => this.bindActionProps(this.props)))
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
      fragmentId: this.fragmentId,
      dispatch: this.dispatch,
      getState: this.store.getState,
      renderScheduler: this.renderScheduler
    }
  }

  bindActionProps(props) {
    return mapValues(bindAction(this.context.fragmentId), props)
  }

  render(){
    this.update.off()
    return <View { ...this.bindActionProps(this.props) } fragmentId={this.fragmentId}/>
  }
}