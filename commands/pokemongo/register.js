module.exports = {
	cooldown: 0,
	help: `Registers you in the PoGo room!`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		const HTML = `<center><form data-submitsend="/msgroom ${room}, /botmsg ${Bot.status.nickName},${prefix}pogoregister IGN: {ign}, Code: {friendcode}, Level: {level}" style="padding:15px;"><table><tr><td><label for="ign">Pokemon Go username: </label></td><td><input type="text" id="ign" name="ign" style="width:180px;"/></td></tr><tr><td><label for="friendcode">Pokemon Go Friend Code: </label></td><td><input type="text" id="friendcode" name="friendcode" style="width:100px;"/></td></tr><tr><td><label for="level">Pokemon Go level: </label></td><td><input type="text" id="level" name="level" style="width:20px;"/></td></tr></table><br/><input type="submit" value="Register!"></form></center>`;
		if (!isPM && tools.hasPermission(by, 'gamma', room)) Bot.say(room, `/addhtmlbox ${HTML}`);
		else if (typeof isPM === 'string') Bot.sendHTML(isPM, HTML);
		else Bot.say(room, `/sendprivatehtmlbox ${by}, ${HTML}`);
	}
}