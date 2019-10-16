module.exports = {
    cooldown: 1000,
    help: `Displays a list of commands that can be used by the user. For details of individual commands, use ${prefix}help (command)`,
    permissions: 'locked',
    commandFunction: function (Bot, room, time, by, args, client) {
        let outstr = '/pminfobox ' + by + ',';
        outstr += '<DETAILS><SUMMARY>Global commands:</SUMMARY><HR>';
        globalComObj = {};
        fs.readdirSync('./commands/global').filter(command => command.endsWith('.js')).forEach(command => {
        	let commandReq = require('./' + command);
        	let name = command.substr(0, command.length - 3);
        	if (!globalComObj[commandReq.permissions]) globalComObj[commandReq.permissions] = [name];
        	else globalComObj[commandReq.permissions].push(name);
        });
        for (let prop in globalComObj) {
        	if (['admin', 'coder', 'alpha', 'beta', 'gamma'].includes(prop)) {
	        	globalComObj[prop] = globalComObj[prop]?globalComObj[prop].sort().join(', '):'';
	        	if (tools.hasPermission(by, prop)) {
	        		outstr += '<DETAILS><SUMMARY>' + prop.charAt(0).toUpperCase() + prop.substr(1) + ' Commands</SUMMARY><HR>' + globalComObj[prop] + '<BR><BR></DETAILS>';
	        	}
	        }
        };
        if (!globalComObj.none) globalComObj.none = [];
        if (!globalComObj.locked) globalComObj.locked = [];
        if (tools.hasPermission(by, 'none')) {
        	globalComObj.none.forEach(comd => {
        		globalComObj.locked.push(comd);
        	});
        }
        outstr += '<DETAILS><SUMMARY>Commands</SUMMARY><HR>' + (globalComObj.locked.sort().join(', ') || 'None.') + '</DETAILS></DETAILS>';
        if (fs.readdirSync('./commands').includes(room)) {
        	outstr += '<HR><DETAILS><SUMMARY>' + room + ' commands:</SUMMARY><HR>';
        	roomComObj = {};
        	fs.readdirSync('./commands/' + room).filter(command => command.endsWith('.js')).forEach(command => {
        		let commandReq = require('../' + room + '/' + command);
        		let name = command.substr(0, command.length - 3);
        		if (!roomComObj[commandReq.permissions]) roomComObj[commandReq.permissions] = [name];
        		else roomComObj[commandReq.permissions].push(name);
        	});
        	for (let prop in roomComObj) {
	        	if (['admin', 'coder', 'alpha', 'beta', 'gamma'].includes(prop)) {
		        	roomComObj[prop] = roomComObj[prop]?roomComObj[prop].sort().join(', '):'None.';
		        	if (tools.hasPermission(by, prop)) {
		        		outstr += '<DETAILS><SUMMARY>' + prop.charAt(0).toUpperCase() + prop.substr(1) + ' Commands</SUMMARY><HR>' + roomComObj[prop] + '<BR><BR></DETAILS>';
		        	}
		        }
	        };
	        if (!roomComObj.none) roomComObj.none = [];
	        if (!roomComObj.locked) roomComObj.locked = [];
	        if (tools.hasPermission(by, 'none')) {
	        	roomComObj.none.forEach(comd => {
	        		roomComObj.locked.push(comd);
	        	});
	        }
	        outstr += '<DETAILS><SUMMARY>Commands</SUMMARY><HR>' + (roomComObj.locked.sort().join(', ') || 'None.') + '</DETAILS></DETAILS>';
        }
        Bot.say('botdevelopment', outstr);
    }
}