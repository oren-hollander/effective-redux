import { forEach } from 'lodash/fp'
import { renderTree, renderNode, schedule, sort } from './renderTree'

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