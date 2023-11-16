import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
const input = require("input");
import env from "./src/common/utils/env"

const apiId = Number(env.apiId);
const apiHash = String(env.apiHash);
const stringSession = new StringSession(``);
const getClient = async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  await client.sendMessage("me", {
    message: "Copy your session key:: \n\n\n" + `${client.session.save()}`,
  });
};

getClient();
