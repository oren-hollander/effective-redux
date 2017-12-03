import React, { PureComponent } from 'react'
import { object } from 'prop-types'
import { defaultTo, isFunction, noop } from 'lodash/fp'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { noStorage } from './noStorage'
import { windowAnimationFrameRenderer } from './animationFrameRenderer'
import { pure } from 'recompose'

export const Fragment = Symbol('Fragment')

export const fragment = (fragmentId, View, reducerOrReducerCreator, subscriptions = noop, storage = noStorage) => class Comp extends PureComponent {

  static contextTypes = {
    store: object
  }

  static childContextTypes = {
    store: object
  }

  storageKey = `effective/fragment/${fragmentId.toString()}`

  componentWillMount() {
    const reducer = isFunction(reducerOrReducerCreator) 
      ? reducerOrReducerCreator(() => this.props) 
      : reducerOrReducerCreator
    
    const preloadedState = defaultTo(undefined, storage && storage.getItem(this.storageKey))
    this.store = createStore(reducer, preloadedState && JSON.parse(preloadedState), effectiveStoreEnhancer(this.context.store, fragmentId))
    subscriptions(this.store.dispatch)
    const render = this.forceUpdate.bind(this)
    this.unsubscribe = this.store.subscribe(windowAnimationFrameRenderer(render))
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