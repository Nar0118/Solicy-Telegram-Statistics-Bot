import TelegramApi, { Message } from "node-telegram-bot-api";
import { StringSession } from "telegram/sessions";
import { Client } from "./client.service";
import TelegramBot from "node-telegram-bot-api";
import { start } from "../commands/start";
import { stop } from "../commands/stop";
import { stats } from "../commands/stats";
import { stats_yesterday } from "../commands/stats_yesterday";
import { help } from "../commands/help";
import env from "../../common/utils/env";
import { stats_date } from "../commands/stats_date";
import { stats_week } from "../commands/stats_week";
import { stats_week_current } from "../commands/stats_week_current";
import { stats_week_last } from "../commands/stats_week_last";
import { stats_month } from "../commands/stats_month";
import { stats_month_current } from "../commands/stats_month_current";
import { stats_month_last } from "../commands/stats_month_last";
import { stats_life } from "../commands/stats_life";

export class Bot {
  private BOT_TOKEN: string;
  private bot: TelegramBot;

  constructor() {
    this.BOT_TOKEN = env.botToken ?? "";
    this.bot = new TelegramApi(this.BOT_TOKEN, { polling: true });
  }

  public async startBot(): Promise<void> {
    await this.setCommands();
    this.handleCommands();
  }

  private async handleCommands(): Promise<void> {
    const client = this.connectClient();
    client.connectClient();

    this.bot.on("message", async (ctx) => {
      if (ctx.text?.split(" ") && ctx.text?.split(" ").length > 1) {
        await this.handleCommandsWithArgs(ctx, client);
      } else {
        await this.handleCommandsWithoutArgs(ctx, client);
      }
    });
  }

  private async handleCommandsWithoutArgs(
    ctx: Message,
    client: Client
  ): Promise<void> {
    const botNickName = await this.bot.getMe().then((res) => res.username);
    switch (ctx.text) {
      case `/start@${botNickName}`:
      case "/start":
        await start(ctx, this.sendSticker);
        break;
      case `/help@${botNickName}`:
      case "/help":
        await help(ctx, this.sendSticker);
        break;
      case `/stop@${botNickName}`:
      case "/stop":
        await stop(ctx, {}, this.sendSticker);
        break;
      case `/stats@${botNickName}`:
      case "/stats":
        await stats(this.bot, ctx, {}, this.sendSticker, client);
        break;
      case `/stats_yesterday@${botNickName}`:
      case "/stats_yesterday":
        await stats_yesterday(this.bot, ctx, {}, this.sendSticker, client);
        break;
      case `/stats_week_current@${botNickName}`:
      case "/stats_week_current":
        await stats_week_current(this.bot, ctx, {}, this.sendSticker, client);
        break;
      case `/stats_week_last@${botNickName}`:
      case "/stats_week_last":
        await stats_week_last(this.bot, ctx, {}, this.sendSticker, client);
        break;
      case `/stats_month_current@${botNickName}`:
      case "/stats_month_current":
        await stats_month_current(this.bot, ctx, {}, this.sendSticker, client);
        break;
      case `/stats_month_last@${botNickName}`:
      case "/stats_month_last":
        await stats_month_last(this.bot, ctx, {}, this.sendSticker, client);
        break;
      case `/stats_life@${botNickName}`:
      case "/stats_life":
        await stats_life(this.bot, ctx, this.sendSticker, client);
        break;
    }
  }
  private async handleCommandsWithArgs(
    ctx: Message,
    client: Client
  ): Promise<void> {
    if (ctx.text?.split(" ")[0] === "/stats_date") {
      await stats_date(
        this.bot,
        ctx,
        {},
        this.sendSticker,
        client,
        ctx.text?.split(" ")[1]
      );
    } else if (ctx.text?.split(" ")[0] === "/stats_week") {
      await stats_week(
        this.bot,
        ctx,
        {},
        this.sendSticker,
        client,
        ctx.text.split(" ")[1]
      );
    } else if (ctx.text?.split(" ")[0] === "/stats_month") {
      await stats_month(
        this.bot,
        ctx,
        {},
        this.sendSticker,
        client,
        ctx.text.split(" ")[1]
      );
    } else if (ctx.text?.split(" ")[0] === "/stats_life") {
      await stats_life(
        this.bot,
        ctx,
        this.sendSticker,
        client,
        ctx.text.split(" ")[1]
      );
    }
  }

  private sendSticker = async (
    chatId: number,
    sticker: string,
    message?: string
  ): Promise<void> => {
    await this.bot.sendSticker(chatId, sticker);
    message && (await this.bot.sendMessage(chatId, message));
  };

  private connectClient(): Client {
    const SESSION_KEY = env.sessionKey ?? "";
    const stringSession = new StringSession(SESSION_KEY);
    const client = new Client(stringSession);
    return client;
  }

  private async setCommands(): Promise<void> {
    await this.bot.setMyCommands([
      {
        command: "start",
        description: "Start the bot",
      },
      { command: "stop", description: "Stop the bot" },
      { command: "help", description: "Show the commands" },
      { command: "stats", description: "Get daily statistics of current day" },
      {
        command: "stats_yesterday",
        description: "Get daily statistics of prev day",
      },
      {
        command: "stats_week_current",
        description: "Get statistics of current week",
      },
      {
        command: "stats_week_last",
        description: "Get statistics of last week",
      },
      {
        command: "stats_month_current",
        description: "Current month statistics",
      },
      {
        command: "stats_month_last",
        description: "Last month statistics",
      },
      {
        command: "stats_life",
        description: "Users info",
      },
    ]);
  }
}
