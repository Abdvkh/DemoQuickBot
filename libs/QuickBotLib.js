let LIB_PREFIX = 'QuickBotLib_'

function setCommands(commandsObj) {
   Bot.setProperty(LIB_PREFIX + 'Commands', commandsObj, 'Object');
}

function getCommands() {
   return Bot.getProperty(LIB_PREFIX + 'Commands');
}

function getCommand(commandName) {
   let commands = getCommands();
   let command = commands[commandName];
   if (command) {
      return command;
   }
   return {error: 'There is no command or command is not defined'};
}

function messageHandler(message) {
   if(message) {
      let commands = getCommands();
      if (commands['aliases']) {
         Object.entries(commands['aliases']).forEach((key, value) => {
            let aliases = value.split(',');
            if (aliases.includes(message)) {
               let commandDetails = getCommand(key)
               return runCommand(commandDetails);
            }
         });
      }
   }
}

function runCommand(commandDetails) {
   let msg = '';

   Object.entries(commandDetails).forEach((key, value) => {
      if (key) {
         if (key == 'text') {
            msg += value;
         } else if (key == 'photo' && commandDetails['photo']['url']) {
            msg = '[​](' + value['url'] + ')'
         }
      }
   });

   Bot.sendMessage(msg);
}

publish({
   setCommands: setCommands,
   messageHandler: messageHandler,
})
