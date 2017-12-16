export const command = asyncFunction => (...args) => ({ asyncFunction, args, injectServices: false })
export const commandWithServices = asyncFunction => (...args) => ({ asyncFunction, args, injectServices: true })

export const execute = services => ({ asyncFunction, args, injectServices }) => 
  injectServices 
    ? asyncFunction(services, ...args)
    : asyncFunction(...args)

export const batch = (...commands) => commands