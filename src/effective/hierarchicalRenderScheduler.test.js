import { forEach } from 'lodash/fp'
import { hierarchicalRenderScheduler } from './hierarchicalRenderScheduler'

const makeTestRequestAnimationFrame = () => {
  
  let animationFrameCallbacks = []

  const requestAnimationFrame = callback => {
    animationFrameCallbacks = [...animationFrameCallbacks, callback]
  }

  let fireAnimationFrame = millis => {
    forEach(animationFrameCallback => animationFrameCallback(millis), animationFrameCallbacks)
    animationFrameCallbacks = []
  }

  return [requestAnimationFrame, fireAnimationFrame]
}