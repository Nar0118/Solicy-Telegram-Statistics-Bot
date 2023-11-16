import TelegramBot, { Message } from "node-telegram-bot-api";

import { stickersFileIds } from "../../common/utils/messages";
import { Client } from "../service/client.service";
import { DailyReaction } from "../service/dailyReaction.service";
import { getStatsMessageByDay } from "../../common/helpers/messageВyDay.helper";
import { Dates } from "../../common/enums/dates";
import { TSendSticker } from "../../common/types/botTypes";
export const stats_date = async (
  bot: TelegramBot,
  ctx: Message,
  connection: any,
  sendSticker: TSendSticker,
  client: Client,
  date: string
): Promise<void> => {
  try {
    console.log(`/stats_date - ${ctx.chat.title}`);
    await sendSticker(ctx.chat.id, stickersFileIds.statics_sticker);

    const dailyData = await new DailyReaction(
      client,
      ctx.chat.id,
      Dates.CUSTOM,
      date
    ).getStatistics();

    const statsMessage: string = getStatsMessageByDay({
      chatTitle: ctx.chat.title ?? "",
      date: Dates.CUSTOM,
      dailyData,
      custom: date,
    });

    await bot.sendMessage(ctx.chat.id, statsMessage);
  } catch (err: any) {
    console.log("Stats Custom Error::", err.message);
  }
};
