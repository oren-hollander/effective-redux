import { forEach, concat } from 'lodash/fp'
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
  let resolvers = []
  let renderRequested = false

  const notify = () => {
    forEach(invoke, resolvers)
    resolvers = []
    renderRequested = false
  }

  const requestRender = () => {
    if(!renderRequested){
      renderRequested = true
      parentRenderScheduler.scheduleChild().then(notify)
    }
  }

  const scheduleOwn = () => new Promise(resolve => {
    resolvers = concat([resolve], resolvers)
    requestRender()
  })

  const scheduleChild = () => new Promise(resolve => {
    resolvers = concat(resolvers, [resolve])    
    requestRender()
  })

  return { scheduleOwn, scheduleChild }
}