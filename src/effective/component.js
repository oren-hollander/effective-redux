import React, { Component } from 'react'
import { object } from 'prop-types'
import { defaultTo, isFunction } from 'lodash/fp'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'

export const COMPONENT = Symbol('Component')

const randomIdGenerator = (prefix) => {
  let counter = 0
  return () => {
    counter++
    return prefix + counter
  }
}

export const component = (componentId, View, reducerOrReducerCreator, subscriptions) => storage => class Comp extends Component {

  static contextTypes = {
    store: object
  }

  static childContextTypes = {
    store: object
  }

  static COMPONENT_ACTION = 'component-action'

  static componentAction(action, ciid) {
    return { type: Comp.COMPONENT_ACTION, action, ciid }
  } 

  static nextRandomComponentId = randomIdGenerator('comp_id_')

  storageKey = `effective-component-state-${componentId.toString()}`

  componentWillMount() {
    const reducer = isFunction(reducerOrReducerCreator) 
      ? reducerOrReducerCreator(() => this.props) 
      : reducerOrReducerCreator
    
    const preloadedState = defaultTo(undefined, storage && storage.getItem(this.storageKey))
    this.store = createStore(reducer, preloadedState && JSON.parse(preloadedState), effectiveStoreEnhancer(this.context.store, componentId))
    subscriptions(this.store.dispatch)
    this.unsubscribe = this.store.subscribe(() => this.forceUpdate())
  }

  componentWillUnmount() {
    if(storage){
      storage.setItem(this.storageKey, JSON.stringify(this.store.getState()))
    }
    this.unsubscribe()
  }

  getChildContext() {
    return {
      store: this.store
    }
  }

  render(){
    return <View {...this.props}/>
  }
}