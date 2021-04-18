exports.check = function (message, by, room) {
	by = by.substr(1);
	message = message.replace(/\[\[\]\]/g, '');
	if (toId(message.slice(0, -1)) === toId(Bot.status.nickName) && message.substr(-1) === '?') return Bot.pm(by, `Hi, I'm ${Bot.status.nickName}! I'm a Bot by ${config.owner}. My prefix is \`\`${prefix}\`\`. For more information, use \`\`${prefix}help\`\`.`);
	if (toId(message) === toId(Bot.status.nickName + 'forhelp')) return Bot.pm(by, '-_-');
	// run an autores here
}