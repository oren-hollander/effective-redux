export const hierarchicalRenderer = requestAnimationFrame => {
  let queue = []
  let requestingRender = false

  const schedule = async fragmentId => {
    // if()
    requestAnimationFrame(millis => {
      queue = [...queue, [millis, render]]
    })
  }

  return {
    schedule
  }
}