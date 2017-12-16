import React, { PureComponent } from 'react'
import { string, object } from 'prop-types'
import { noop, isUndefined } from 'lodash/fp'
import { mapValues } from 'lodash/fp'
import { renderSchedulerType, storePropType, fragmentReducersPropType, componentClassRegistryPropType } from './propTypes'
import { idGenerator, breaker } from '../util'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { bindAction } from '../util/bindAction'
import { fragmentStore } from './fragmentStore'

const fragmentIdGenerator = idGenerator('fragment-')

export const fragment = (reducer, subscriptions = noop, fragmentId) => View => class Comp extends PureComponent {

  static contextTypes = {
    store: storePropType,
    fragmentId: string,  
    fragmentStore: storePropType,
    fragmentReducers: fragmentReducersPropType,
    renderScheduler: renderSchedulerType,
    componentClassRegistry: componentClassRegistryPropType,
    services: object
  }

  static childContextTypes = {
    fragmentId: string,  
    fragmentStore: storePropType,  
    renderScheduler: renderSchedulerType
  }

  constructor(props){
    super(props)
    this.getViewProps = this.getViewProps.bind(this)
  }

  getViewProps() {
    return { 
      ...mapValues(bindAction(this.context.fragmentId), this.props), 
      fragmentId: this.fragmentId,
      componentClassRegistry: this.context.componentClassRegistry
    }
  }

  componentWillMount() {
    this.fragmentId = isUndefined(fragmentId) ? fragmentIdGenerator() : fragmentId

    this.fragmentStore = fragmentStore(this.fragmentId, this.context.store)
    this.context.fragmentReducers.install(this.fragmentId, reducer, this.fragmentStore.dispatch, this.getViewProps)
    subscriptions(this.fragmentStore.dispatch)
    
    this.renderScheduler = renderScheduler(this.context.renderScheduler.scheduleChild)
    this.update = breaker(this.forceUpdate.bind(this))

    this.unsubscribe = this.fragmentStore.subscribe(() => {
      this.update.on()
      this.renderScheduler.scheduleOwn().then(this.update)
    })
  }

  componentWillUnmount() {
    this.context.fragmentReducers.uninstall(this.fragmentId)
    this.unsubscribe()
  }

  getChildContext() {
    return {
      fragmentId: this.fragmentId,
      fragmentStore: this.fragmentStore,
      renderScheduler: this.renderScheduler
    }
  }

  render(){
    this.update.off()
    return <View { ...this.getViewProps() } />
  }
}