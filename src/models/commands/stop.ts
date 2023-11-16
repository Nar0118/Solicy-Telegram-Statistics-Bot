import { Message } from "node-telegram-bot-api";
import { stickersFileIds, mainBotMessages } from "../../common/utils/messages";
import { TSendSticker } from "../../common/types/botTypes";

export const stop = async (
  ctx: Message,
  connection: any,
  sendSticker: TSendSticker
): Promise<void> => {
  try {
    console.log(`/stop - ${ctx.chat.title}`);
    await sendSticker(
      ctx.chat.id,
      stickersFileIds.set_stop_sticker,
      mainBotMessages.set_stop_message
    );
  } catch (error) {
    console.error("Stop Error::", error);
  }
};
