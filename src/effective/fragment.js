import React, { PureComponent } from 'react'
import { string } from 'prop-types'
import { noop, isUndefined } from 'lodash/fp'
import { mapValues } from 'lodash/fp'
import { renderSchedulerType, storePropType, fragmentReducersPropType } from './propTypes'
import { idGenerator, breaker } from '../util'
import { renderScheduler } from './hierarchicalRenderScheduler'
import { bindAction } from '../util/bindAction'
import { fragmentStore } from './fragmentStore'

const fragmentIdGenerator = idGenerator('fragment-')

export const fragment = (View, reducer, subscriptions = noop, fragmentId) => class Comp extends PureComponent {

  static contextTypes = {
    store: storePropType,
    fragmentId: string,  
    fragmentStore: storePropType,
    fragmentReducers: fragmentReducersPropType,
    renderScheduler: renderSchedulerType
  }

  static childContextTypes = {
    fragmentId: string,  
    fragmentStore: storePropType,  
    renderScheduler: renderSchedulerType
  }

  
  componentWillMount() {
    const s = View
    this.fragmentId = isUndefined(fragmentId) ? fragmentIdGenerator() : fragmentId

    this.fragmentStore = fragmentStore(this.fragmentId, this.context.store)
    this.context.fragmentReducers.install(this.fragmentId, reducer, this.fragmentStore.dispatch, () => this.bindActionProps(this.props))
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

  bindActionProps(props) {
    return mapValues(bindAction(this.context.fragmentId), props)
  }

  render(){
    this.update.off()
    return <View { ...this.bindActionProps(this.props) } fragmentId={this.fragmentId}/>
  }
}