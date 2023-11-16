export type TSendSticker = (
  chatId: number,
  stick: string,
  message?: string
) => Promise<void>;
