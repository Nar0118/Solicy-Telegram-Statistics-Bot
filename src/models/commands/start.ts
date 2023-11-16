import { Message } from "node-telegram-bot-api";
import { stickersFileIds } from "../../common/utils/messages";
import { TSendSticker } from "../../common/types/botTypes";

export const start = async (
  ctx: Message,
  sendSticker: TSendSticker
): Promise<void> => {
  try {
    console.log(`/start - ${ctx.chat.title}`);

    await sendSticker(ctx.chat.id, stickersFileIds.start_bg_sticker);
  } catch (err: any) {
    console.log("Start Error::", err.message);
  }
};
