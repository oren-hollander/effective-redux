export const breaker = f => {
  let isOn = true

  const on = () => {
    isOn = true
  }

  const off = () => {
    isOn = false
  }

  const callIfOn = (...args) => {
    if(isOn)
      return f(...args)
  }

  callIfOn.on = on
  callIfOn.off = off

  return callIfOn
}