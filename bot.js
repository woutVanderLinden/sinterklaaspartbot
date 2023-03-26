'use strict';
const http = require('http');
const SDClient = require('./client.js');
global.Discord = require('discord.js');
const express = require('express');
const { loadMessages, reactToReacts } = require('./discord_reacts.js');

require('./global.js');

const options = {
	nickName: config.nickName,
	pass: config.pass,
	avatar: config.avatar ?? null,
	status: config.status ?? null,
	autoJoin: config.autoJoin,
	debug: config.debug
};

global.app = express();
global.Bot = new SDClient(options);
global.client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'], autoReconnect: true });

Bot.connect();
const minor = require('./minorhandler');
minor.initialize();
Object.keys(minor).forEach(key => Bot.on(key, minor[key]));
Bot.on('battle', (...args) => require('./battle.js').handler(...args));
Bot.chatHandler = require('./chat.js');
Bot.pmHandler = require('./pmhandler.js');
Bot.pageHandler = require('./pages.js');
Bot.processHandler = require('./processhandler.js').init(Bot);
Bot.on('chat', (room, time, by, message) => Bot.chatHandler(room, time, by, message));
Bot.on('pm', (by, message) => Bot.pmHandler(by, message));
Bot.router = require('./router.js');
Bot.ticker = setInterval(() => require('./ticker.js')(Bot), 55 * 1000);
Bot.schedule = require('./schedule.js')();

client.on('message', (...args) => require('./discord.js').handler(...args));
client.login(config.token, err => console.log(err));
client.on('ready', () => {
	console.log('Connected to Discord');
	client.user.setActivity('Type Challenge: Ghost!');
	loadMessages(client).then(() => client.on('messageReactionAdd', (...args) => reactToReacts(...args)));
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get(/.*/, (req, res) => Bot.router.get(req, res));
app.post(/.*/, (req, res) => Bot.router.post(req, res));
const server = app.listen(config.webPort, () => console.log(`The website\'s up at ${websiteLink}!`));
