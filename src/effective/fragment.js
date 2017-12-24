import React, { PureComponent } from 'react'
import { string } from 'prop-types'
import { mapValues, flow, noop, isUndefined, unset, set } from 'lodash/fp'
import { idGenerator } from '../util/idGenerator'
import { breaker } from '../util/breaker'
import { bindAction } from '../util/bindAction'
import { fragmentStore } from './fragmentStore'
import { renderSchedulerType, fragmentStorePropType, storePropType, fragmentReducersPropType } from './propTypes'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { defineAction } from '../util/actionDefinition'

const fragmentIdGenerator = idGenerator('fragment-')

export const MOUNT = 'mount'
const mount = defineAction(MOUNT)

export const UNMOUNT = 'unmount'
const unmount = defineAction(UNMOUNT)


export const fragment =  (reducer, subscriptions = noop) => View => class Comp extends PureComponent {

  static contextTypes = {
    store: storePropType,
    fragmentId: string,  
    fragmentStore: fragmentStorePropType,
    fragmentReducers: fragmentReducersPropType,
    renderScheduler: renderSchedulerType
  }

  static childContextTypes = {
    fragmentId: string,  
    fragmentStore: fragmentStorePropType,  
    renderScheduler: renderSchedulerType
  }

  constructor(props){
    super(props)
    this.getViewProps = this.getViewProps.bind(this)
  }

  getViewProps() {
    return flow(
      mapValues(bindAction(this.context.fragmentId)),
      set('fragmentId', this.fragmentId),
      unset('persistFragment')
    )(this.props)
  }

  componentWillMount() {
    this.fragmentId = isUndefined(this.props.fragmentId) ? fragmentIdGenerator() : this.props.fragmentId

    this.fragmentStore = fragmentStore(this.fragmentId, this.context.store)
    this.context.fragmentReducers.install(this.fragmentId, reducer, this.fragmentStore.dispatch, this.getViewProps)
    
    subscriptions(this.fragmentStore.dispatch)

    this.fragmentStore.dispatch(mount)
    
    this.renderScheduler = renderScheduler(this.context.renderScheduler.scheduleChild)
    this.update = breaker(this.forceUpdate.bind(this))

    this.unsubscribe = this.fragmentStore.subscribe(() => {
      this.update.on()
      this.renderScheduler.scheduleOwn().then(this.update)
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
    this.fragmentStore.dispatch(unmount)
    this.context.fragmentReducers.uninstall(this.fragmentId, this.props.persistFragment)
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