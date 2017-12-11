import { forEach, concat, noop } from 'lodash/fp'
import { renderTree, renderNode, schedule, sort } from './renderTree'
import { invoke } from '../util'

export const hierarchicalRenderScheduler = requestAnimationFrame => {
  let tree
  let animationFrameRequested

  const resetSchedule = () => {
    tree = renderTree()        
    animationFrameRequested = false
  }

  resetSchedule()
  
  const notify = () => forEach(node => node.render(), sort(tree))    

  return (fragmentPath, render) => {
    tree = schedule(renderNode(fragmentPath, render), tree)
    if(!animationFrameRequested){
      requestAnimationFrame(ms => {
        notify()
        resetSchedule()
      })
      animationFrameRequested = true
    }
  }
}

export const renderScheduler = parentRenderScheduler => {
  let ownResolver
  let childResolvers
  let renderRequested

  const reset = () => {
    ownResolver = noop
    childResolvers = []
    renderRequested = false      
  }
  
  const notify = () => {
    ownResolver()
    forEach(invoke(), childResolvers)
    reset()
  }

  const requestRender = () => {
    if(!renderRequested){
      renderRequested = true
      parentRenderScheduler().then(notify)
    }
  }

  const scheduleOwn = () => new Promise(resolve => {
    requestRender()
    ownResolver = resolve
  })
  
  const scheduleChild = () => new Promise(resolve => {
    childResolvers = concat(childResolvers, [resolve])    
    requestRender()
  })

  reset()

  return { scheduleOwn, scheduleChild }
}