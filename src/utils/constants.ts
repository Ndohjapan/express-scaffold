import { config } from "../config/env"
const { maxConsecutiveFailsByUsernameAndIp, maxLoginByUsernamePerDay, maxWrongAttemptsByIpPerDay, maxWrongAttemptsByUsernamePerDay } = config.security

export const paginationPage = 1
export const paginationLimit = 100
export const securityLimits = {
  maxConsecutiveFailsByUsernameAndIp,
  maxLoginByUsernamePerDay,
  maxWrongAttemptsByIpPerDay,
  maxWrongAttemptsByUsernamePerDay
}

// You can also keep a default export if needed
export default {
  paginationPage,
  paginationLimit,
  ...securityLimits
}
