import TelegramBot, { Message } from "node-telegram-bot-api";
import { stickersFileIds } from "../../common/utils/messages";
import { Client } from "../service/client.service";
import { UserStats } from "../service/usersStatistics.service";
import { getUserStatsMessage } from "../../common/helpers/userStatsMessage.helper";
import { TSendSticker } from "../../common/types/botTypes";

export const stats_life = async (
  bot: TelegramBot,
  ctx: Message,
  sendSticker: TSendSticker,
  client: Client,
  username?: string
) => {
  console.log(`/stats_life- ${ctx.chat.title}`);
  await sendSticker(ctx.chat.id, stickersFileIds.statics_sticker);
  const usersStatsObj = new UserStats(ctx.chat.id, client);

  const data = username
    ? await usersStatsObj.getUserInfo(username)
    : await usersStatsObj.getUsersInfo();

  bot.sendMessage(ctx.chat.id, getUserStatsMessage(data));
};
