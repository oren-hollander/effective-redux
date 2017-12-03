import { forEach } from 'lodash/fp'
import { renderTree, renderNode, schedule } from './renderTree'

export const hierarchicalRenderScheduler = requestAnimationFrame => {
  let tree
  let animationFrameRequested

  const resetSchedule = () => {
    tree = renderTree()        
    animationFrameRequested = false
  }

  resetSchedule()
  
  return (fragmentPath, render) => {
    tree = schedule(renderNode(fragmentPath, render), tree)
    if(!animationFrameRequested){
      requestAnimationFrame(ms => {
        forEach(node => node.render(), tree)
        resetSchedule()
      })
      animationFrameRequested = true
    }
  }
}