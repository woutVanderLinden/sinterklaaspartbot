'use strict';
const http = require('http');
const SDClient = require('./client.js');
global.Discord = require('discord.js');
const express = require('express');
require('./global.js');
global.app = express();
const options = { serverid: config.serverid, loginServer: 'https://play.pokemonshowdown.com/~~' + config.serverid + '/action.php', nickName: config.nickName, pass: config.pass, avatar: (config.avatar) ? config.avatar : null, status: (config.status) ? config.status : null, autoJoin: config.autoJoin, app: app };

global.Bot = new SDClient(config.server, config.port, options);
global.client = new Discord.Client({partials: ['MESSAGE', 'REACTION']});

client.on('message', require('./discord.js').handler);
client.login(config.token, err => console.log(err));
client.on("ready", () => {
	console.log(`Connected to Discord.`);
	client.user.setActivity("Type Challenge: Ghost!");
});

Bot.connect();

const minor = require('./minorhandler').handler;
minor.initialize();
Object.keys(minor).forEach(key => Bot.on(key, minor[key]));
Bot.on('battle', (...args) => require('./battle.js').handler(...args));

Bot.chatHandler = require('./chat.js');
Bot.pmHandler = require('./pmhandler.js');
Bot.processHandler = require('./processhandler.js').init();
Bot.on('chat', (room, time, by, message) => Bot.chatHandler(room, time, by, message));
Bot.on('pm', (by, message) => Bot.pmHandler(by, message));

Bot.router = require('./router.js');
Bot.ticker = setInterval(() => require('./ticker.js')(Bot), 55 * 1000);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.get(/.*/, (req, res) => Bot.router.get(req, res));
app.post(/.*/, (req, res) => Bot.router.post(req, res));
const server = app.listen(config.PORT, () => console.log(`The website\'s up at ${websiteLink}!`));