import { Message } from "node-telegram-bot-api";
import { stickersFileIds, mainBotMessages } from "../../common/utils/messages";
import { TSendSticker } from "../../common/types/botTypes";

export const help = async (
  ctx: Message,
  sendSticker: TSendSticker
): Promise<void> => {
  try {
    console.log(`/help - ${ctx.chat.title}`);
    await sendSticker(
      ctx.chat.id,
      stickersFileIds.help_sticker,
      mainBotMessages.help_message
    );
  } catch (err: any) {
    console.log("Help Error::", err.message);
  }
};
