import React, { Component } from 'react'
import { func, object, string } from 'prop-types'
import { mapValues, identity, defaultTo } from 'lodash/fp'
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

export const component = (componentId, View, reducerCreator, mapStateToProps = {state: identity}) => storage => class Comp extends Component {
  static propTypes = {
    ciid: string
  }

  static contextTypes = {
    emit: func,
    store: object,
    installComponentReducer: func,
    uninstallComponentReducer: func
  }

  static childContextTypes = {
    emit: func
  }

  static COMPONENT_ACTION = 'component-action'

  static componentAction(action, ciid) {
    return { type: Comp.COMPONENT_ACTION, action, ciid }
  } 

  static nextRandomComponentId = randomIdGenerator('comp_id_')

  storageKey = `effective-component-state-${componentId.toString()}`

  componentWillMount() {
    const preloadedState = defaultTo(undefined, storage && storage.getItem(this.storageKey))
    this.store = createStore(reducerCreator(() => this.props), preloadedState && JSON.parse(preloadedState), effectiveStoreEnhancer(this.context.store, componentId))
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
      emit: this.store.dispatch
    }
  }

  render(){
    const state = this.store.getState()
    const props = mapValues(selector => selector(state), mapStateToProps)
    return <View {...props} {...this.props}/>
  }
}