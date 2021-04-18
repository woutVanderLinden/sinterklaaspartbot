'use strict';
const http = require('http');
const SDClient = require('./client.js');
const Discord = require('discord.js');
const globaljs = require('./global.js');
const express = require('express');
global.app = express();

const options = { serverid: config.serverid, loginServer: 'https://play.pokemonshowdown.com/~~' + config.serverid + '/action.php', nickName: config.nickName, pass: config.pass, avatar: (config.avatar) ? config.avatar : null, status: (config.status) ? config.status : null, autoJoin: config.autoJoin, app: app, logRooms: config.logRooms };

global.Bot = new SDClient(config.server, config.port, options);
global.client = new Discord.Client({partials: ['MESSAGE', 'REACTION']});

client.on('message', require('./discord.js').handler);
if (config.token) client.login(config.token, err => console.log(err));
client.on("ready", () => {
	console.log(`Connected to Discord.`);
	client.user.setActivity("Doing stuff"); // Set your Discord activity here
});

let standard_input = process.stdin; standard_input.setEncoding('utf-8'); standard_input.on('data', function(data) { try {console.log(eval(data))} catch(e) {console.log(e)}});

Bot.connect();

let minor = require('./minorhandler').handler;
minor.initialize();
Object.keys(minor).forEach(key => Bot.on(key, minor[key]));
Bot.on('battle', (...args) => require('./battle.js').handler(...args));

Bot.chatHandler = require('./chat.js');
Bot.on('chat', (room, time, by, message) => {
	return Bot.chatHandler(room, time, by, message);
});
Bot.on('pm', (by, message) => {
	if (message.startsWith('/invite')) {
		for (let room of config.autoJoin) {if (message.startsWith(`/invite ${room}`)) return Bot.joinRooms([room])};
		if (['%', '@', '&', '~'].includes(by.charAt(0)) || tools.hasPermission(by, 'beta')) return Bot.joinRooms([message.split('/invite')[1]]);
		return Bot.pm(by, "Sorry, only global staff can invite me.");
	}
	if (!message.startsWith(prefix)) {
		if (!Bot.auth.admin.includes(toId(by))) {
			if (Bot.lastPMHelp == toId(by)) return;
			Bot.lastPMHelp = toId(by);
			return Bot.pm(by, `Hi, I'm ${Bot.status.nickName}! I'm a Bot. My prefix is \`\`${prefix}\`\`. For an overview of my commands, use \`\`${prefix}commands\`\`.`);
		}
		return;
	}
	let args = message.substr(prefix.length).split(' ');
	let commandName = tools.pmCommandAlias(args.shift());
	if (!commandName) return;
	if (['eval','output'].includes(commandName)) {
		if (!tools.hasPermission(toId(by), 'admin')) return Bot.pm(by, 'Access denied.');
		try {
			let outp = eval(args.join(' '));
			switch (typeof outp) {
				case 'object': outp = JSON.stringify(outp, null, 2); break;
				case 'function': outp = outp.toString(); break;
				case 'undefined': outp = 'undefined'; break;
			}
			Bot.pm(by, '!code ' + String(outp));
		} catch (e) {console.log(e); Bot.pm(by, e.message); Bot.log(e)};
		return;
	}
	fs.readdir('./pmcommands', (err, files) => {
		if (err) {Bot.auth.admin.forEach(adm => Bot.pm(adm, err.message)); Bot.log(err)};
		let commands = files.map(file => file.slice(0, file.length - 3));
		if (!commands.includes(commandName)) return Bot.pm(by, `It doesn't look like that command exists.`);
		let commandRequire = require(`./pmcommands/${commandName}.js`);
		tools.grantPseudo(by);
		if (!tools.hasPermission(by, commandRequire.permissions)) {
			tools.spliceRank(by);
			return Bot.pm(by, 'Access denied.');
		}
		try {
			commandRequire.commandFunction(Bot, by, args, client);
			return tools.spliceRank(by);
		} catch (e) {
			if (e) {Bot.pm(by, e.message); return Bot.log(e)};
		}
	});
	return;
});

Bot.router = require('./router.js');
Bot.ticker = setInterval(() => require('./ticker.js')(Bot), 55 * 1000);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.get(/.*/, (req, res) => Bot.router.get(req, res));
app.post(/.*/, (req, res) => Bot.router.post(req, res));
let server = app.listen(config.PORT, () => { console.log(`The website\'s up at ${websiteLink}!`) });

process.on('uncaughtException', error => {
	console.log(error);
	Bot.log(error).then(() => {
		Promise.all(Object.values(Bot.streams).map(stream => {
			return new Promise((resolve, reject) => {
				stream.writeStream.once('end', () => resolve());
				stream.end();
			});
		})).then(() => {
			process.exit(1);
		});
	}).catch(err => {
		Bot.log(err);
		process.exit(1);
	});
})