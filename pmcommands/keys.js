module.exports = {
	help: `Displays all current keyed websites on ${Bot.status.nickName}.`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
	  if (!Object.keys(Bot.keys).length) return Bot.pm(by, 'None.');
    return Bot.sendHTML(by, Object.keys(Bot.keys).sort().map(user => `<A href="http://${process.env.PROJECT_DOMAIN}.glitch.me/${user}-${Bot.keys[user]}">${user}</A>`).join('<BR>'));
	}
}