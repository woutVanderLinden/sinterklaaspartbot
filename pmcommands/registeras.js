module.exports = {
	noDisplay: true,
	help: `Registers someone in the PoGo room!`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const room = 'pokemongo';
		const HTML = `<center><form data-submitsend="/msgroom ${room}, /botmsg ${Bot.status.nickName},${prefix}pogoregisteras {psname}, IGN: {ign}, Code: {friendcode}, Level: {level}" style="padding:15px;"><table><tr><td><label for="ign">Pokemon Go username: </label></td><td><input type="text" id="ign" name="ign" style="width:180px;"/></td></tr><tr><td><label for="psname">PS username: </label></td><td><input type="text" id="psname" name="psname" style="width:180px;"/></td></tr><tr><td><label for="friendcode">Pokemon Go Friend Code: </label></td><td><input type="text" id="friendcode" name="friendcode" style="width:100px;"/></td></tr><tr><td><label for="level">Pokemon Go level: </label></td><td><input type="text" id="level" name="level" style="width:20px;"/></td></tr></table><br/><input type="submit" value="Register!"></form></center>`;
		Bot.say(room, `/sendprivatehtmlbox ${by}, ${HTML}`);
	}
}