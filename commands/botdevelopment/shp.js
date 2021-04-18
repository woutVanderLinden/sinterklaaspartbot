module.exports = {
	cooldown: 1,
	help: `-`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `/sendhtmlpage PartMan,A,<form>	<label>Room: <input type="text" name="room" autofocus /></label>	<label>Text: <input type="text" name="text" /></label><button name="submit" type="submit" value=",sayin {toID-room}, {text}">Submit</button></form>`);
	}
}