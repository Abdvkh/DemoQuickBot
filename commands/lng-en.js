var commands = {
   code: "en",

   aliases: {
      "start": "/start, begin, hi",
   },

   start: {
      text: "Start text",
      photoURL: ""
   }
}

Libs.QuickBotLib.setCommandsByLang(commands, commands.code);
