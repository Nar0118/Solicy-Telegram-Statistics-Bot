import "dotenv/config";
import { EnvVariables } from "../types/envType";

const env: EnvVariables = {
  sessionKey: process.env.SESSION_KEY,
  apiId: process.env.API_ID,
  apiHash: process.env.API_HASH,
  botToken: process.env.BOT_TOKEN,
  startTime: process.env.START_TIME,
  timeDeltaHours: process.env.TIMEDELTA_HOURS,
  armeniaTimeZone: process.env.ARMENIA_TIME_ZONE,
};

export default env;
