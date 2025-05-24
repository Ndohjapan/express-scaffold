import rollbar from "./loggingConn";
import mongoose from "mongoose";
import { RateLimiterMongo } from 'rate-limiter-flexible'
import mongoosePaginate from 'mongoose-paginate-v2'
import { config } from "../config/env";
import { paginationLimit, paginationPage, securityLimits } from '../utils/constants'

let limiterSlowBruteByIP;
let limiterConsecutiveFailsByUniqueIdAndIP;
let limiterSlowBruteByUniqueId;
let limiterByUniqueId;

mongoosePaginate.paginate.options = {
  page: paginationPage,
  limit: paginationLimit,
  allowDiskUse: true,
  sort: { createdAt: -1 },
};

async function connectToDatabase(DB_URL = config.database.URI) {
  try {
    console.log('Connecting to Database...');
    const conn = await mongoose.connect(DB_URL);
    if (config.env != 'test') {
      console.log('Connected to Database successfully');
    }
    setRateLimterInstances(mongoose.connection);
    return conn;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    if (error instanceof Error) {
      rollbar.error(error);
    }
    throw error; // Re-throw the error to handle it outside
  }
}
function setRateLimterInstances(mongo_conn: mongoose.Connection) {
  limiterSlowBruteByIP = new RateLimiterMongo({
    storeClient: mongo_conn,
    keyPrefix: 'login-fail-ip-per-day',
    points: securityLimits.maxWrongAttemptsByIpPerDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 10, // Block for 10 hrs, if 20 wrong attempts per day
  });

  limiterConsecutiveFailsByUniqueIdAndIP = new RateLimiterMongo({
    storeClient: mongo_conn,
    keyPrefix: 'login-fail-consecutive-unique-id-and-ip',
    points: securityLimits.maxConsecutiveFailsByUsernameAndIp,
    duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
    blockDuration: 60 * 60 * 10, // Block for 10hrs hrs after consecutive fails
  });

  limiterSlowBruteByUniqueId = new RateLimiterMongo({
    storeClient: mongo_conn,
    keyPrefix: 'login-fail-unique-id-per-day',
    points: securityLimits.maxWrongAttemptsByUsernamePerDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 10, // Block for 10hrs after 15 fails in 24 hrs
  });

  limiterByUniqueId = new RateLimiterMongo({
    storeClient: mongo_conn,
    keyPrefix: 'login-unique-id-per-day',
    points: securityLimits.maxLoginByUsernamePerDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 10, // Block for 10hrs after 15 fails in 24 hrs
  });
}
// Export other necessary functions and objects
export {
  mongoosePaginate,
  mongoose,
  connectToDatabase,
  limiterSlowBruteByIP,
  limiterConsecutiveFailsByUniqueIdAndIP,
  limiterSlowBruteByUniqueId,
  limiterByUniqueId
};