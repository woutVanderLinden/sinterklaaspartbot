module.exports = {
	cooldown: 1000,
	help: `Updates stuff. Syntax: ${prefix}update (experts / samples / discord / vr / all)`,
	permissions: 'alpha',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) return Bot.say(room, unxa);
		switch (toID(args[0])) {
			case 'experts7': {
				const readline = require('readline');
				const { google } = require('googleapis');
				const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
				const TOKEN_PATH = './data/DATA/token.json';
				fs.readFile('./data/DATA/credentials.json', (err, content) => {
					if (err) return Bot.say(room, 'Error loading client secret file:', err);
					authorize(JSON.parse(content), updateExperts);
				});
				function authorize (credentials, callback) {
					const { client_secret, client_id, redirect_uris } = credentials.installed;
					const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
					fs.readFile(TOKEN_PATH, (err, token) => {
						if (err) return getNewToken(oAuth2Client, callback);
						oAuth2Client.setCredentials(JSON.parse(token));
						callback(oAuth2Client);
					});
				}
				function getNewToken (oAuth2Client, callback) {
					const authUrl = oAuth2Client.generateAuthUrl({
						access_type: 'offline',
						scope: SCOPES
					});
					console.log('Authorize this app by visiting this url:', authUrl);
					Bot.pm(by, 'Visit: ' + authUrl);
					const rl = readline.createInterface({
						input: process.stdin,
						output: process.stdout
					});
					rl.question('Enter the code from that page here: ', (code) => {
						rl.close();
						oAuth2Client.getToken(code, (err, token) => {
							if (err) return console.error('Error retrieving access token', err);
							oAuth2Client.setCredentials(token);
							fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
								if (err) console.error(err);
								console.log('Token stored to', TOKEN_PATH);
							});
							callback(oAuth2Client);
						});
					});
				}
				function updateExperts (auth) {
					const docs = google.docs({ version: 'v1', auth });
					docs.documents.get({
						documentId: '11h2oL3gWldbgDQeadka3HXjkTTHnJLSjWAMfBgNH7qo'
					}, (err, res) => {
						if (err) return Bot.say(room, 'The API returned an error: ' + err);
						const docta = res.data;
						const darr = docta.body.content.reduce((paragraphs, paragraphObj) => paragraphObj.paragraph ? [...paragraphs, paragraphObj.paragraph.elements.map(element => element.textRun.content)] : paragraphs, []);
						const flarr = ['module.exports = {'];
						const sarr = darr.join('').split('\n\n\n\n');
						const ObjExp = {};
						typelist.forEach(function (stype) {
							const sutype = stype.toUpperCase();
							sarr.forEach(function (vrstf) {
								if (vrstf.includes(sutype)) {
									const tspl = vrstf.split('\n');
									tspl.forEach(function (vrlin) {
										if (vrlin.startsWith('Expert(s): ')) {
											const tempexp = vrlin.substr(11).split(', ');
											const exparr = [];
											tempexp.forEach(function (texpert) {
												if (texpert === '') return;
												exparr.push('\"' + toID(texpert) + '\"');
											});
											ObjExp[stype] = '[' + exparr.join(', ') + ']';
										}
									});
								}
							});
							flarr.push(stype + ': ' + ObjExp[stype]);
						});
						const fout = flarr.shift() + '\n	' + flarr.join(',\n	') + '\n}';
						const eout = fs.readFileSync('./data/EXPERTS/tc7.js', 'utf8');
						Bot.log(eout);
						fs.writeFile('./data/EXPERTS/tc7.js', fout, function (error) {
							if (error) return Bot.say(room, error);
							delete require.cache[require.resolve('../../data/EXPERTS/tc7.js')];
							Bot.log(`${by.substr(1)} updated Gen7 Experts.`);
							Bot.say(room, `Gen7 Experts have been updated.`);
						});
					});
				}
				break;
			}
			case 'vr7': {
				switch (args[1] ? args[1].toLowerCase() : undefined) {
					case 'tc': {
						if (!args[2]) return Bot.say(room, 'Type, please.');
						const giventype = args[2].toLowerCase();
						if (!typelist.includes(giventype)) return Bot.say(room, 'Invalid type.');
						const readline = require('readline');
						const { google } = require('googleapis');
						const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
						const TOKEN_PATH = './data/DATA/token.json';
						fs.readFile('./data/DATA/credentials.json', (err, content) => {
							if (err) return Bot.say(room, 'Error loading client secret file:', err);
							authorize(JSON.parse(content), updateVR);
						});
						function authorize (credentials, callback) {
							const { client_secret, client_id, redirect_uris } = credentials.installed;
							const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
							fs.readFile(TOKEN_PATH, (err, token) => {
								if (err) return getNewToken(oAuth2Client, callback);
								oAuth2Client.setCredentials(JSON.parse(token));
								callback(oAuth2Client);
							});
						}
						function getNewToken (oAuth2Client, callback) {
							const authUrl = oAuth2Client.generateAuthUrl({
								access_type: 'offline',
								scope: SCOPES
							});
							console.log('Authorize this app by visiting this url:', authUrl);
							const rl = readline.createInterface({
								input: process.stdin,
								output: process.stdout
							});
							rl.question('Enter the code from that page here: ', (code) => {
								rl.close();
								oAuth2Client.getToken(code, (err, token) => {
									if (err) return console.error('Error retrieving access token', err);
									oAuth2Client.setCredentials(token);
									fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
										if (err) console.error(err);
										console.log('Token stored to', TOKEN_PATH);
									});
									callback(oAuth2Client);
								});
							});
						}
						function updateVR (auth) {
							const docs = google.docs({ version: 'v1', auth });
							docs.documents.get({
								documentId: '11h2oL3gWldbgDQeadka3HXjkTTHnJLSjWAMfBgNH7qo'
							}, (err, res) => {
								if (err) return Bot.say(room, 'The API returned an error: ' + err);
								const docta = res.data;
								const darr = docta.body.content.reduce((paragraphs, paragraphObj) => paragraphObj.paragraph ? [...paragraphs, paragraphObj.paragraph.elements.map(element => element.textRun.content)] : paragraphs, []);
								const flarr = [];
								const stext = darr.join('').split('\n\n\n\n');
								stext.forEach(function (element) {
									if (element.includes(giventype.toUpperCase())) flarr.push(element);
								});
								if (!flarr.length === 1) return Bot.say(room, 'Something went wrong. Please check the VR Document for errors in spacing.');
								const trarr = ['S+: ', 'S: ', 'S-: ', 'A+: ', 'A: ', 'A-: ', 'B+: ', 'B: ', 'B-: ', 'C+: ', 'C: ', 'C-: ', 'D: ', 'E: ', 'Untiered: ', 'Ban(s): '];
								const tgarr = ['sp', 's', 'sm', 'ap', 'a', 'am', 'bp', 'b', 'bm', 'cp', 'c', 'cm', 'd', 'e', 'unt', 'bans'];
								function toLe (text) {
									if (text === 'S+: ') return 'sp: ';
									else if (text === 'S: ') return 's: ';
									else if (text === 'S-: ') return 'sm: ';
									else if (text === 'A+: ') return 'ap: ';
									else if (text === 'A: ') return 'a: ';
									else if (text === 'A-: ') return 'am: ';
									else if (text === 'B+: ') return 'bp: ';
									else if (text === 'B: ') return 'b: ';
									else if (text === 'B-: ') return 'bm: ';
									else if (text === 'C+: ') return 'cp: ';
									else if (text === 'C: ') return 'c: ';
									else if (text === 'C-: ') return 'cm: ';
									else if (text === 'D: ') return 'd: ';
									else if (text === 'E: ') return 'e: ';
									else if (text === 'Untiered: ') return 'unt: ';
									else if (text === 'Ban(s): ') return 'bans: ';
									else return;
								}
								const barr = [];
								const vrarr = flarr[0].split('\n');
								trarr.forEach(function (element) {
									let foundIt = false;
									vrarr.forEach(function (ruw) {
										if (!ruw.startsWith(element)) return;
										foundIt = true;
										const tstr = ruw.substr(element.length);
										const tfarr = tstr.split(', ');
										barr.push(toLe(element) + "[\"" + tfarr.join('\", \"') + "\"]");
									});
									if (!foundIt) barr.push(toLe(element) + "[]");
								});
								const fout = 'exports.' + giventype + ' = {\n	' + barr.join(',\n	') + '\n}';
								const eout = fs.readFileSync(`./data/VR/TC7/${giventype}.js`);
								Bot.log(String(eout));
								fs.writeFile(`./data/VR/TC7/${giventype}.js`, fout, function (error) {
									if (error) return Bot.say(room, error);
									delete require.cache[require.resolve(`../../data/VR/TC7/${args[2].toLowerCase()}.js`)];
									Bot.log(`${tools.toName(by)} updated the Gen7 TC ${tools.toName(args[2].toLowerCase())} VR.`);
									Bot.say(room, `The Gen7 TC ${tools.toName(args[2].toLowerCase())} VR has been updated.`);
								});
							});
						}
						break;
					}
					case 'tcu': {
						break;
					}
				}
				break;
			}
			case 'samples7': case 'ss7': case 'samplesets7': {
				if (!args[1] || args[2]) return Bot.say(room, unxa);
				const gtype = toID(args[1]);
				const readline = require('readline');
				const { google } = require('googleapis');
				const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
				const TOKEN_PATH = './data/DATA/token.json';
				fs.readFile('./data/DATA/credentials.json', (err, content) => {
					if (err) return console.log('Error loading client secret file:', err);
					authorize(JSON.parse(content), doStuff);
				});
				function authorize (credentials, callback) {
					const { client_secret, client_id, redirect_uris } = credentials.installed;
					const oAuth2Client = new google.auth.OAuth2(
						client_id, client_secret, redirect_uris[0]);
					fs.readFile(TOKEN_PATH, (err, token) => {
						if (err) return getNewToken(oAuth2Client, callback);
						oAuth2Client.setCredentials(JSON.parse(token));
						callback(oAuth2Client);
					});
				}
				function getNewToken (oAuth2Client, callback) {
					const authUrl = oAuth2Client.generateAuthUrl({
						access_type: 'offline',
						scope: SCOPES
					});
					console.log('Authorize this app by visiting this url:', authUrl);
					const rl = readline.createInterface({
						input: process.stdin,
						output: process.stdout
					});
					rl.question('Enter the code from that page here: ', (code) => {
						rl.close();
						oAuth2Client.getToken(code, (err, token) => {
							if (err) return console.error('Error retrieving access token', err);
							oAuth2Client.setCredentials(token);
							fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
								if (err) console.error(err);
								console.log('Token stored to', TOKEN_PATH);
							});
							callback(oAuth2Client);
						});
					});
				}
				function doStuff (auth) {
					const docs = google.docs({ version: 'v1', auth });
					docs.documents.get({
						documentId: '1hgZ7_hp5GvxZLSuTW-mKyAbCsEg6s9zYxjVb7UqS_UU'
					}, (err, res) => {
						if (err) return console.log('The API returned an error: ' + err);
						const docta = res.data;
						const darr = docta.body.content.reduce((paragraphs, paragraphObj) => paragraphObj.paragraph ? [...paragraphs, paragraphObj.paragraph.elements.map(element => element.textRun.content)] : paragraphs, []);
						const gtra = docta.body.content.filter(onj => onj.hasOwnProperty("paragraph"));
						const uwlg = gtra.filter(hoj => hoj.paragraph.hasOwnProperty("elements"));
						const linkobj = [];
						uwlg.forEach(function (thingy) {
							let sutr = '';
							thingy.paragraph.elements.forEach(function (wuut) {
								if (!wuut.hasOwnProperty('textRun') || !wuut.textRun.hasOwnProperty('content') || !wuut.textRun.hasOwnProperty('textStyle') || !wuut.textRun.textStyle.hasOwnProperty('link') || !wuut.textRun.textStyle.link.hasOwnProperty('url')) return;
								sutr = `${wuut.textRun.content}: ${wuut.textRun.textStyle.link.url}`;
							});
							linkobj.push(sutr);
						});
						const setarr = [];
						const samplearr = [];
						let outputt = false;
						linkobj.forEach(function (uwu) {
							if (!uwu.includes(':')) return;
							if (uwu.includes('Sample Sets')) {
								samplearr.push(uwu);
								if (uwu.toLowerCase().startsWith(gtype)) outputt = uwu;
							} else setarr.push(uwu);
						});
						if (!outputt) return Bot.say(room, `Unable to find ${tools.toName(gtype)} Sample Sets.`);
						const linadv = outputt.split('ets: ');
						const rlink = linadv[1].endsWith('/json') ? linadv[1] : linadv[1] + '/json';
						const request = require('request');
						request(rlink, function (e, response, body) {
							if (e) return Bot.say(room, e);
							const sets = JSON.parse(body).paste;
							const sampleObj = JSON.parse(fs.readFileSync('./data/SAMPLES/TC7/sets.json', 'utf8'));
							if (sampleObj[gtype]) console.log(sampleObj[gtype]);
							sampleObj[gtype] = sets;
							fs.writeFile('./data/SAMPLES/TC7/sets.json', JSON.stringify(sampleObj), e => {
								if (e) return Bot.log(e);
								Bot.say(room, 'The Gen7 ' + tools.toName(gtype) + ' samples have been updated.');
								return Bot.log(by.substr(1) + ' updated the Gen7 ' + tools.toName(gtype) + ' samples.');
							});
						});
					});
				}
				break;
			}
			case 'sampleteams7': case 'teams7': case 'st7': {
				if (args[1]) return Bot.say(room, unxa);
				const readline = require('readline');
				const { google } = require('googleapis');
				const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
				const TOKEN_PATH = './data/DATA/token.json';
				fs.readFile('./data/DATA/credentials.json', (err, content) => {
					if (err) return console.log('Error loading client secret file:', err);
					authorize(JSON.parse(content), doStuff);
				});
				function authorize (credentials, callback) {
					const { client_secret, client_id, redirect_uris } = credentials.installed;
					const oAuth2Client = new google.auth.OAuth2(
						client_id, client_secret, redirect_uris[0]);
					fs.readFile(TOKEN_PATH, (err, token) => {
						if (err) return getNewToken(oAuth2Client, callback);
						oAuth2Client.setCredentials(JSON.parse(token));
						callback(oAuth2Client);
					});
				}
				function getNewToken (oAuth2Client, callback) {
					const authUrl = oAuth2Client.generateAuthUrl({
						access_type: 'offline',
						scope: SCOPES
					});
					console.log('Authorize this app by visiting this url:', authUrl);
					const rl = readline.createInterface({
						input: process.stdin,
						output: process.stdout
					});
					rl.question('Enter the code from that page here: ', (code) => {
						rl.close();
						oAuth2Client.getToken(code, (err, token) => {
							if (err) return console.error('Error retrieving access token', err);
							oAuth2Client.setCredentials(token);
							fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
								if (err) console.error(err);
								console.log('Token stored to', TOKEN_PATH);
							});
							callback(oAuth2Client);
						});
					});
				}
				function doStuff (auth) {
					const docs = google.docs({ version: 'v1', auth });
					docs.documents.get({
						documentId: '1hgZ7_hp5GvxZLSuTW-mKyAbCsEg6s9zYxjVb7UqS_UU'
					}, (err, res) => {
						if (err) return console.log('The API returned an error: ' + err);
						const docta = res.data;
						const base = docta.body.content.filter(elem => elem.paragraph && elem.paragraph.elements).map(elem => elem.paragraph.elements.map(group => {
							const summary = [];
							if (group.textRun && group.textRun.content && /\[[A-Z]+\]$/.test(group.textRun.content) && group.textRun.textStyle && group.textRun.textStyle.link && group.textRun.textStyle.link.url.replace(/\s/g, '')) summary.push([group.textRun.content.match(/\[[A-Z]+\]$/)[0].toLowerCase().replace(/[^a-z0-9]/g, ''), group.textRun.content.substr(0, group.textRun.content.length - group.textRun.content.match(/\[[A-Z]+\]$/)[0].length), group.textRun.textStyle.link.url.replace(/\s/g, '')]);
							return summary;
						}).filter(group => group)).filter(elem => elem[0] && elem[1]).map(elem => elem[0]).filter(m => m[0]).map(elem => elem[0]);
						const teamsObj = {};
						const teams = {};
						let total = 0;
						let counter = 0;
						base.forEach(arr => {
							if (!teamsObj[arr[0]]) {
								teamsObj[arr[0]] = {};
							}
							teamsObj[arr[0]][arr[1]] = arr[2];
							total++;
						});
						Object.keys(teamsObj).forEach(type => {
							Object.keys(teamsObj[type]).forEach(team => {
								let link = teamsObj[type][team];
								if (!link.endsWith('/json')) link += '/json';
								if (!link.includes('pokepast.es')) return console.log('>>');
								require('request')(link, (err, resp, body) => {
									if (err) return console.log(err);
									const paste = JSON.parse(body).paste;
									if (!teams[type]) teams[type] = {};
									teams[type][team] = paste;
									if (++counter == total) {
										Bot.log(fs.readFileSync('./data/SAMPLES/TC7/teams.json', 'utf8'));
										fs.writeFile('./data/SAMPLES/TC7/teams.json', JSON.stringify(teams), e => {
											if (e) return Bot.log(e);
											Bot.say(room, 'Gen7 Sample teams have been updated.');
											return Bot.log(by.substr(1) + ' updated Gen7 sample teams.');
										});
									}
								});
							});
						});
					});
				}
				break;
			}
			default: {
				Bot.say(room, 'Doesn\'t exist, yet.');
				break;
			}
		}
	}
};
