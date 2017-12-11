import React, { PureComponent } from 'react'
import { func } from 'prop-types'
import { set, isFunction } from 'lodash/fp'

import { renderSchedulerType } from './propTypes'
import { idGenerator, breaker } from '../util'
import { renderScheduler } from './hierarchicalRenderScheduler'

export const Fragment = Symbol('Fragment')
export const fragmentAction = fragmentId => action => {

  if(isFunction(action)){
    const f = (...args) => action(...args)
    f[Fragment] = fragmentId
    return f
  }
  else {
    return set([Fragment], fragmentId, action)
  }
}

export const fragmentMiddleware = fragmentId => ({ getState, dispatch }) => next => action => {
  if(action[Fragment] === fragmentId){
    return dispatch(action) 
  }
  else {
    return next(action)
  }      
}

export const fragmentStoreEnhancer = () => nextStoreCreator => (reducer, preloadedState) => {
  return nextStoreCreator(reducer, preloadedState)
}

export const fragment = (fragmentId, View, storeCreator) => class Comp extends PureComponent {

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
    this.store = storeCreator()
    const dispatch = this.store.dispatch
    this.store.dispatch = action => {
      if(action[Fragment] === fragmentId){
        return dispatch(action) 
      }
      else {
        this.context.store.dispatch(action)
      }      
    }

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
    // const dispatch = action => {
    //   if(action[Fragment] === fragmentId){
    //     return this.store.dispatch(action) 
    //   }
    //   else {
    //     this.context.store.dispatch(action)
    //   }
    // }

    return {
      dispatch: this.store.dispatch,
      getState: this.store.getState,
      renderScheduler: this.renderScheduler
    }
  }

  render(){
    this.update.off()
    return <View {...this.props}/>
  }
}