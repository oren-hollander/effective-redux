import { curry } from 'lodash/fp'

export const animationFrameRenderer = curry((requestAnimationFrame, render) => {
  let rendering = false
  return () => {
    if(!rendering){
      rendering = true
      requestAnimationFrame((ms) => {
        console.log(ms)
        render()
        rendering = false
      })
    }
  }
})

export const windowAnimationFrameRenderer = animationFrameRenderer(window.requestAnimationFrame)