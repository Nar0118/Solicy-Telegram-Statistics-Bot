import TelegramBot, { Message } from "node-telegram-bot-api";

import { stickersFileIds } from "../../common/utils/messages";
import { Client } from "../service/client.service";
import { DailyReaction } from "../service/dailyReaction.service";
import { getStatsMessageByDay } from "../../common/helpers/messageВyDay.helper";
import { Dates } from "../../common/enums/dates";
import { TSendSticker } from "../../common/types/botTypes";

export const stats_week_current = async (
  bot: TelegramBot,
  ctx: Message,
  connection: any,
  sendSticker: TSendSticker,
  client: Client,
  date?: string
): Promise<void> => {
  try {
    console.log(`/stats_week_current - ${ctx.chat.title}`);
    await sendSticker(ctx.chat.id, stickersFileIds.statics_sticker);

    const dailyData = await new DailyReaction(
      client,
      ctx.chat.id,
      Dates.CURRENT_WEEK,
      date
    ).getStatistics();

    const statsMessage: string = getStatsMessageByDay({
      chatTitle: ctx.chat.title ?? "",
      date: Dates.CURRENT_WEEK,
      dailyData,
    });

    await bot.sendMessage(ctx.chat.id, statsMessage);
  } catch (err: any) {
    console.log("Stats Current Week Error::", err.message);
  }
};
