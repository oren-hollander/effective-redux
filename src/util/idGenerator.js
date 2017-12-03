export const idGenerator = prefix => {
  let count = 1
  return () => `${prefix}${count++}`
}