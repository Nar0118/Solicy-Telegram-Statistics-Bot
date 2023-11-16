import TelegramApi from "node-telegram-bot-api";
import { Bot } from "./models/service/bot.service";

// import ReportBotService from "path/to/your/ReportBot.service";
// import schedule = from "node-schedule";

// const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
// const SUPABASE_DB_URI = process.env.SUPABASE_URL;
// const SESSION_STRING_PATH = process.env.SESSION_STRING_PATH;
// const REPORT_TABLE_NAME_IN_DB = process.env.REPORT_TABLE_NAME_IN_DB;

const send_sticker = async (
  bot: TelegramApi,
  id: number,
  sticker: string,
  msg?: string
) => {
  await bot.sendSticker(id, sticker);
  msg && (await bot.sendMessage(id, msg));
};

const runMainBot = async () => {
  const bot = new Bot();
  await bot.startBot();
};

runMainBot();

// function get_session_and_sheet_key(chat_id: number) {
//   const sheet_key = ReportBotService.getSheetKeyByChatId(chat_id);
//   return [SESSION_KEY, sheet_key];
// }

// function schedule() {
//   schedule.scheduleJob(‘58 17 * * *’, ReportService.runMain);

//   setInterval(() => {}, 1000)
// }

// function run_on_windows() {
//  ReportService.runMain();
// }
// const os = require(‘os’);

// if (os.platform() !== ‘win32’) {
//   schedule()
// } else {
//   run_on_windows();
// }
