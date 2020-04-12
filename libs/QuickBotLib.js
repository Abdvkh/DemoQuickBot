let LIB_PREFIX = 'QuickBotLib_'

function languagesSetup(languages) {
   let savedLanguages = Bot.getProperty('languages');
   let languagesCodeArr = Object.keys(languages);
   if (typeof savedLanguages == 'array' || savedLanguages.length < languagesCodeArr.length) {
      Bot.setProperty('languages', languagesCodeArr, 'Array');
      for (let langCode in languagesCodeArr) {
         if (languagesCodeArr.hasOwnProperty(langCode)) {
            Bot.run({command: 'lng-' + key});
         };
      }
      Bot.sendMessage('Languages are set!');
   }
}

function getDefaultLanguage(){
  return Bot.getProperty(LIB_PREFIX + 'default');
}

function setDefaultLanguage(langCode){
  Bot.setProperty(LIB_PREFIX + 'default', langCode, 'string');
}

function setCommandsByLang(commands, langCode){
   Bot.setProperty(LIB_PREFIX + langCode + 'LangCommands', commands, 'JSON');
   let def = getDefaultLanguage();
   if(!def){ setDefaultLanguage(langCode) }
}

function getCommandsByLangCode(langCode) {
   let commands = Bot.getProperty(LIB_PREFIX + langCode + 'LangCommands');

   if (!commands) {
      let defLang = Bot.getProperty(LIB_PREFIX + 'default' + 'Commands');
      if (!defLang) {
         return {'error': 'No commands are set'};
      }
      return Bot.getProperty(LIB_PREFIX + defLang + 'LangCommands');
   }

   return {};
}

function setUserLanguage(curLangCode){
  User.setProperty(LIB_PREFIX + 'curLangCode', curLangCode, 'string');
}

function getUserLanguage(){
  if(user){
    let lng = User.getProperty(LIB_PREFIX + 'curLangCode');
    if(lng){ return lng }
  }
  return getDefaultLanguage();
}

function getUserLanguageCommands() {
   let userLang = getUserLanguage();
   return Bot.getProperty(LIB_PREFIX + userLang + 'LangCommands');
}

function getCommand(commandName) {
   let commands = getUserLanguageCommands();
   let command = commands[commandName];
   if (command) {
      return command;
   }
   return {error: 'There is no command or command is not defined'};
}

function messageHandler(message) {
   let langCode = getUserLanguage();
   let commands = getCommandsByLangCode(langCode);
   if (commands['aliases']) {
      Object.entries(commands['aliases']).forEach((key, value) => {
         if (value.includes(message)) {
            let commandDetails = getCommand(key)
            return runCommand(commandDetails);
         }
      });
   }
}

function runCommand(commandDetails) {
   let msg = '';

   Object.entries(commandDetails).forEach((key, value) => {
      if (key) {
         if (key == 'photoURL') {
            value = '[​](' + value + ')'
         }
         msg += value;
      }
   });

   Bot.sendMessage(msg);
}

publish({
   setCommandsByLang: setCommandsByLang,
   languagesSetup: languagesSetup,
   messageHandler: messageHandler,
})
