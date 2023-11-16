import TelegramBot, { Message } from "node-telegram-bot-api";

import { stickersFileIds } from "../../common/utils/messages";
import { Client } from "../service/client.service";
import { DailyReaction } from "../service/dailyReaction.service";
import { getStatsMessageByDay } from "../../common/helpers/messageВyDay.helper";
import { Dates } from "../../common/enums/dates";
import { TSendSticker } from "../../common/types/botTypes";

export const stats_month_last = async (
  bot: TelegramBot,
  ctx: Message,
  connection: any,
  sendSticker: TSendSticker,
  client: Client,
  date?: string
): Promise<void> => {
  try {
    console.log(`/stats_month_last - ${ctx.chat.title}`);
    await sendSticker(ctx.chat.id, stickersFileIds.statics_sticker);

    const dailyData = await new DailyReaction(
      client,
      ctx.chat.id,
      Dates.LAST_MONTH,
      date
    ).getStatistics();

    const statsMessage: string = getStatsMessageByDay({
      chatTitle: ctx.chat.title ?? "",
      date: Dates.LAST_MONTH,
      dailyData,
    });

    await bot.sendMessage(ctx.chat.id, statsMessage);
  } catch (err: any) {
    console.log("Stats Last Month Error::", err.message);
  }
};
