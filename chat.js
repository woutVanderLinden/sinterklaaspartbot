exports.check = function (message, by, room) {
	if (!['hydrocity'].includes(room)) return;;
	by = by.substr(1);
  if (/kicks.*snom/.test(message)) return Bot.say(room, '/me kicks ' + by);
	if (toId(message) == 'kden' && toId(by) == 'joltofjustice') return Bot.say(room, 'Kden.');
	if (/^\/me flee/.test(message)) return Bot.say(room, `/me catches ${by}`);
	if (/^me runs/.test(message)) return Bot.say(room, `/me chases ${by} down`);
	if (/^\/me hides/.test(message) && !message.toLowerCase().includes(Bot.status.nickName.toLowerCase())) return Bot.say(room, `/me places a big arrow above ${by}`);
	if (/^right/.test(message) && toId(by) !== 'partman') return;
	if (new RegExp(`, ?${Bot.status.nickName}\.?$`, 'i').test(message) && !/\. /.test(message)) return Bot.say(room, message.replace(new RegExp(`, ?${Bot.status.nickName}\.?$`, 'i'), '') + ', ' + by + '.');
	if (new RegExp(`^/me .*${Bot.status.nickName}$`, 'i').test(message) && !/\bpart(?:man)?\b/i.test(message) && !message.match(new RegExp(Bot.status.nickName + '.+' + Bot.status.nickName, 'i'))) return Bot.say(room, message.replace(new RegExp(`${Bot.status.nickName}`, 'i'), by));
	if (new RegExp(`^${Bot.status.nickName} is a `, 'i').test(message)) return Bot.say(room, 'N-no, you.');
}