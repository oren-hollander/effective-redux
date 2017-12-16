export const command = asyncFunction => (...args) => ({ asyncFunction, args, serviceNames: [] })
export const withServices = command => (...serviceNames) => ({ ...command, serviceNames })

export const execute = ({ asyncFunction, args, serviceNames }) => asyncFunction(...args)

export const batch = (...commands) => commands