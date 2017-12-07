export const command = asyncFunction => (...args) => ({ asyncFunction, args })

export const execute = ({ asyncFunction, args }) =>
{
  return asyncFunction(...args)
} 

export const batch = (...commands) => commands