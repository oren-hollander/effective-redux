import { forEach, join } from 'lodash/fp'
import { renderTree, renderNode, schedule2 } from './renderTree'

export const hierarchicalRenderScheduler = requestAnimationFrame => {
  let tree
  let animationFrameRequested
  let canceledFragments

  const resetSchedule = () => {
    tree = renderTree()        
    animationFrameRequested = false
    canceledFragments = {}
  }

  resetSchedule()
  
  const notify = () => {
    forEach(node => {
      const path = join('.', node.path)
      if(!canceledFragments[path])
        node.render()
    }, tree)    
  }

  const schedule = (fragmentPath, render) => {
    tree = schedule2(renderNode(fragmentPath, render), tree)
    if(!animationFrameRequested){
      requestAnimationFrame(() => {
        notify()
        resetSchedule()
      })
      animationFrameRequested = true
    }
  }

  const cancel = fragmentPath => {
    canceledFragments = {...canceledFragments, [fragmentPath]: true}
  }

  return {
    schedule, 
    cancel
  }
}