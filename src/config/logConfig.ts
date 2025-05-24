export const LOG_RETENTION = {
  REQUEST: {
    // Keep request logs for 7 days
    NORMAL: 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
    ERROR: 30 * 24 * 60 * 60 * 1000   // 30 days for error requests
  },
  ERROR: {
    // Keep error logs for 30 days
    DEFAULT: 30 * 24 * 60 * 60 * 1000  // 30 days in milliseconds
  }
};