export const numberGenerator = function*(start = 0) {
  while(true)
      yield start++
}

export const idGenerator = prefix => {
  let numbers = numberGenerator(1)
  return () => `${prefix}${numbers.next().value}`
}