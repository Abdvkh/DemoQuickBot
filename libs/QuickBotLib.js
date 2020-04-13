let LIB_PREFIX = 'QuickBotLib_'
let LangLib = getLangLib();

function getLangLib() {
   let LangLib = Libs.Lang;
   if (!LangLib) {
      throw new Error("Please install LangLib for using QuickBotLib");
   }
   return LangLib;
}

function setCommands(commandsObj) {
   let langCode = '';
   let language = commandsObj['language'];
   let commands = commandsObj['commands'];
   if (language) {
      langCode += language;
      LangLib.setDefaultLanguage(language);
   }
   Bot.setProperty(LIB_PREFIX + langCode + 'Commands', commands, 'Object');
}

function getCommands() {
   let langCode = '';
   let curLang = LangLib.user.getCurLang();
   if (curLang) {
      langCode = curLang;
   }
   return Bot.getProperty(LIB_PREFIX + langCode + 'Commands');
}

function getCommand(commandName) {
   let commands = getCommands();
   let command = commands[commandName];
   if (command) {
      return command;
   }
   return {error: 'There is no command or command is not defined'};
}

function handleMessage(message) {
   if(!message) {return ;}
   let commands = getCommands();
   if (commands['aliases']) {
      Object.entries(commands['aliases']).forEach(([key, value]) => {
         let aliases = value.split(',');
         if (aliases.includes(message) || key == message) {
            let commandDetails = getCommand(key)
            return runCommand(commandDetails);
         }
      });
   }
}

function runCommand(commandDetails) {
   let msg = '';

   Object.entries(commandDetails).forEach(([key, value]) => {
      if (key == 'text') {
         msg += value;
      } else if (key == 'photo' && commandDetails['photo']['url']) {
         msg = '[​](' + value['url'] + ')'
      }
   });

   Bot.sendMessage(msg);
}

publish({
   setCommands: setCommands,
   handleMessage: handleMessage,
})
