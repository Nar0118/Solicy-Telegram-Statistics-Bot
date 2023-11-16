import { Api } from "telegram";
import { isReacted } from "../src/common/helpers/isReacted.helper";

const message = new Api.Message({ id: "id" });

describe("Check isReacted function work", () => {
  it("Check the message to be non reacted", () => {
    expect(isReacted(message)).toBe(false);
  });

  it("Check the message to be wrong reacted", () => {
    const results = new Api.ReactionCount({
      // @ts-ignore
      reaction: {
        emoticon: "😂",
        className: "ReactionEmoji",
      },
    });
    const reaction = new Api.MessageReactions({
      results: [results],
    });
    message.reactions = reaction;
    expect(isReacted(message)).toBe(false);
  });

  it("Check the message to be right reacted", () => {
    const results = new Api.ReactionCount({
      // @ts-ignore
      reaction: {
        emoticon: "👍",
        className: "ReactionEmoji",
      },
    });
    const reaction = new Api.MessageReactions({
      results: [results],
    });
    message.reactions = reaction;
    expect(isReacted(message)).toBe(true);
  });
});
