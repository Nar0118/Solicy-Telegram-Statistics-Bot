import { Api } from "telegram";

import { DISLIKE, LIKE, POSITIVE_REACTIONS } from "../utils/messages";

export const isReacted = (message: Api.Message): boolean => {
  const reaction = message?.reactions?.results;
  let reacted = true;
  if (!reaction) {
    reacted = false;
  } else {
    reaction.forEach(({ reaction }) => {
      if (
        reaction.className === "ReactionEmoji" &&
        !POSITIVE_REACTIONS.includes(reaction.emoticon) &&
        reaction.emoticon !== LIKE &&
        reaction.emoticon !== DISLIKE
      ) {
        reacted = false;
      }
    });
  }
  return reacted;
};
