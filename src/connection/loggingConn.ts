import { config } from '../config/env'
import Rollbar from "rollbar";

const rollbar = new Rollbar({
  accessToken: config.logging.ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbar;