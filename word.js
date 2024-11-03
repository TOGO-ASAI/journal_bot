function wordlist(language) {
  const messages = {
    Japanese: {
      already_done: "今日はすでにジャーナル済みです。また明日やりましょう！",
      language_switched: "言語設定が日本語に切り替わりました。",
      set_journal_time: "ジャーナルの時間をセットしました。",
      change_time_reply:
        "ジャーナルの聖句が自動送信される時刻を設定してください\n・00:00~23:30まで30分単位で時刻を設定することができます。\n・半角の24時間表記で、hh:mm のフォーマットに従って時刻を送信してください。（例: 09:00, 20:30）",
      congrats_message:
        "1か月間ジャーナル達成おめでとう！\n今日からは自分で実際に聖書を読んでジャーナルをしてみよう！！\nhttps://www.bible.com/",
    },
    English: {
      already_done:
        "You've already done Journal today. Let's try the next verse tomorrow!",
      language_switched: "Language is switched to English.",
      set_journal_time: "The journal time has been set.",
      change_time_reply:
        "Please set the time for the journal verse to be automatically sent.\n・You can set the time in 30-minute intervals from 00:00 to 23:30.\n・Please send the time in 24-hour format using half-width characters and follow the hh:mm format (e.g., 09:00, 20:30).",
      congrats_message:
        "Congratulations on completing one month of journaling!\nToday, try reading the Bible yourself and journaling about it!!\nhttps://www.bible.com/",
    },
  };
  return messages[language] || {};
}
