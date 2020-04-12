/*CMD
  command: /admin
  help:
  need_reply: true
  auto_retry_time:
  folder: Admin
  answer: Please enter the password
  keyboard:
  aliases:
CMD*/

var ADMIN_ID = 469750202;
var commonLib = Libs.commonLib;
if(message == '123'){
   Bot.setProperty('admin', ADMIN_ID, 'Number');
   return Bot.sendMessage('Congrats! Now, ' + commonLib.getLinkFor(user) + ' is admin!');
}
