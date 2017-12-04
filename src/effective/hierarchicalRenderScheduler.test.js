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

test('hierarchicalRenderer', () => {

  // const [requestAnimationFrame, fireAnimationFrame] = makeTestRequestAnimationFrame()
  
  // const hr = hierarchicalRenderer(requestAnimationFrame)
  
  // hr.schedule('fragment-1')
  //   .then(done)
  //   .catch(done.fail)

  // fireAnimationFrame()
})
