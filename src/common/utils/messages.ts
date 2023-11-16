// Messages for helper bot
export const helperBotMessages = {
  worker_statics_message:
    "Sorry something gets wrong...Maybe it's dev. error contact with developers",
  report_header: "Chat: {}\n* Date: ⏰ {} *\nTotal: {}\nPositive: {}\n",
  report_message_body: "{}: {} / {}\n",
};

// Messages for telegram main bot
export const mainBotMessages = {
  session_key_error:
    "Wrong key, please contact with @Shitikyan or if you have access to tech doc's read how need's to generate session key (and why ?)",
  set_stop_message: "Report on this chat stopped.",

  help_message:
    "Hmm, it seems you need some help...\n I have some commands which can help you.\n\
    \t\t\t  /start - say hi to bot\n\
    \t\t\t  /help - if you need some help\n\
    \t\t\t  /stats - check today's statistics\n\
    \t\t\t  /stats_yesterday - check yesterday's statistics\n\
    \t\t\t  /stats_date - check statistics for a specified date\n\
    \t\t\t  /stats_week - check statistics for the specified week\n\
    \t\t\t  /stats_week_current - check statistics for the current week\n\
    \t\t\t  /stats_week_last - check statistics for the last week\n\
    \t\t\t  /stats_month - check statistics for a specified month\n\
    \t\t\t  /stats_month_current - check current month statistics\n\
    \t\t\t  /stats_month_last - check statistics for last month\n\
    \t\t\t  /stats_life - get statistics for all users",
  set_key_success: "I get the key, now I will work with this chat too...",
  set_key_err:
    "Error: pls give the chat sheet key,\n\t\t /start sheet_key\nsheet_key change with your sheet key (pls be sure that it's correct otherview I cant save the statistics)",
};

export const stickersFileIds = {
  start_sticker:
    "CAACAgIAAxkBAAEZZ9ZjWrt_mwZ5b2ninwo8X4-HnhmEFwACdQADDbbSGQixzxJqLRhnKgQ", // green bird
  start_bg_sticker:
    "CAACAgIAAxkBAAEa_whjmgQh9EweiWhRYCd4R8HevzdacwACUAsAAi8P8AakWqnP-y3tGCwE",
  crash_sticker:
    "CAACAgIAAxkBAAEZabtjWvlQzHZ6-1Nvi8HComIlgPMAAakAAmMAA9vbfgABjJ0FPedCg-cqBA",
  help_sticker:
    "CAACAgIAAxkBAAEZZ9hjWrwVLB1mC1uqJQtOUVOtlyNwqgAC5QAD9wLIDwn1cYbzUtuDKgQ", // nokia
  usage_sticker:
    "CAACAgIAAxkBAAEZZ9hjWrwVLB1mC1uqJQtOUVOtlyNwqgAC5QAD9wLIDwn1cYbzUtuDKgQ",
  set_key_sticker:
    "CAACAgIAAxkBAAEZacFjWvt-q1Fc1SGnrgLmz_pp0c3HiwACbgAD29t-AAFGnmdxMjn-kyoE",
  statics_sticker:
    "CAACAgIAAxkBAAEZfQhjXr9ARvKQ4b4tc2Yj8HmvM4RplgAClgoAAmXXSEqeC5Vjb_xP4CoE",
  set_stop_sticker:
    "CAACAgIAAxkBAAEa_21jmhQknvq9VyZh0aDWdW376VzAZAACJAkAAhhC7ghwVBDU-Fq5FiwE",
  loading_sticker:
    "CAACAgIAAxkBAAEbAAGLY5pJF-gXdg7ibe2PZoNc1cNY4CMAAksCAAJWnb0KYlBF0FD6cZwsBA",
};

export const POSITIVE_REACTIONS = [ "🔥", "👏"];
export const LIKE = "👍";
export const DISLIKE = "👎";
