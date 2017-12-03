import React, { PureComponent } from 'react'
import { object, func, string } from 'prop-types'
import { defaultTo, noop } from 'lodash/fp'
import { createStore } from 'redux'
import { effectiveStoreEnhancer } from './effectiveStoreEnhancer'
import { noStorage } from './noStorage'
import { windowAnimationFrameRenderer } from './animationFrameRenderer'

export const Fragment = Symbol('Fragment')

export const fragment = (fragmentId, View, reducer, subscriptions = noop, storage = noStorage) => class Comp extends PureComponent {

  static contextTypes = {
    store: object,
    scheduleRender: func,
    fragmentPath: string
  }

  static childContextTypes = {
    store: object, 
    fragmentPath: string
  }

  storageKey = `effective/fragment/${fragmentId.toString()}`

  fragmentPath() {
    return `${this.context.fragmentPath}.${fragmentId.toString()}`
  }

  componentWillMount() {
    const preloadedState = defaultTo(undefined, storage && storage.getItem(this.storageKey))
    this.store = createStore(reducer, preloadedState && JSON.parse(preloadedState), effectiveStoreEnhancer(this.context.store, fragmentId, () => this.props))
    subscriptions(this.store.dispatch)
    const render = this.forceUpdate.bind(this)
    this.unsubscribe = this.store.subscribe(windowAnimationFrameRenderer(render))
    // this.unsubscribe = this.store.subscribe(() => {
    //   const s = this.store.getState()
    //   this.context.scheduleRender(this.fragmentPath(), render)
    // })
  }

  componentWillUnmount() {
    if(storage){
      storage.setItem(this.storageKey, JSON.stringify(this.store.getState()))
    }
    this.unsubscribe()
  }

  getChildContext() {
    return {
      store: this.store,
      fragmentPath: this.fragmentPath()
    }
  }

  render(){
    return <View {...this.props}/>
  }
}