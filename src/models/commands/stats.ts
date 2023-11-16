import TelegramBot, { Message } from "node-telegram-bot-api";
import { helperBotMessages } from "../../common/utils/messages";

import { stickersFileIds } from "../../common/utils/messages";
import { Client } from "../service/client.service";
import { DailyReaction } from "../service/dailyReaction.service";
import { getStatsMessageByDay } from "../../common/helpers/messageВyDay.helper";
import { Dates } from "../../common/enums/dates";
import { TSendSticker } from "../../common/types/botTypes";

export const stats = async (
  bot: TelegramBot,
  ctx: Message,
  connection: any,
  sendSticker: TSendSticker,
  client: Client
): Promise<void> => {
  try {
    console.log(`/stats - ${ctx.chat.title}`);
    await sendSticker(ctx.chat.id, stickersFileIds.statics_sticker);

    const dailyData = await new DailyReaction(
      client,
      ctx.chat.id,
      Dates.TODAY
    ).getStatistics();
    const statsMessage: string = getStatsMessageByDay({
      chatTitle: ctx.chat.title ?? "",
      date: Dates.TODAY,
      dailyData,
    });

    await bot.sendMessage(ctx.chat.id, statsMessage);
  } catch (err: any) {
    bot.sendMessage(ctx.chat.id, helperBotMessages.worker_statics_message);
    console.log("Stats Error::", err.message);
  }
};
