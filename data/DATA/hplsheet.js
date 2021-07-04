const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = '../GAPI/token.json';

const teamValues = {
	'astutemurder': {
		name: 'Astute Murder',
		color: '#702963',
		text: 'white',
		logo: 'https://cdn.discordapp.com/emojis/854608983317676063.png'
	},
	'cinderacestrikers': {
		name: 'Cinderace Strikers',
		color: 'white',
		text: 'red',
		logo: 'https://cdn.discordapp.com/emojis/861213618171674625.png'
	},
	'derekclandinosaurs': {
		name: 'Derek Clan Dinosaurs',
		color: '#add8e6',
		text: 'black',
		logo: 'https://cdn.discordapp.com/emojis/854414277230198794.png'
	},
	'destructivemegarays': {
		name: 'Destructive Mega Rays',
		color: '#00863c',
		text: 'white',
		logo: 'https://cdn.discordapp.com/emojis/854411272262516766.png'
	},
	'indianinfernapes': {
		name: 'Indian Infernapes',
		color: '#ff5a00',
		text: 'black',
		logo: 'https://cdn.discordapp.com/emojis/854412580831494174.png'
	},
	'justifiedterrakions': {
		name: 'Justified Terrakions',
		color: '#e68a00',
		text: 'black',
		logo: 'https://cdn.discordapp.com/emojis/854406224812572692.png'
	},
	'shadowychandelure': {
		name: 'Shadowy Chandelure',
		color: '#d2def1',
		text: '#7352e6',
		logo: 'https://cdn.discordapp.com/emojis/854416437157953596.png'
	},
	'valiantvenusaurs': {
		name: 'Valiant Venusaurs',
		color: '#0cc299',
		text: 'black',
		logo: 'https://cdn.discordapp.com/emojis/855469796581048340.png'
	},
	'null': {
		name: '-',
		color: 'white',
		color: 'black',
		logo: 'https://discord.com/assets/aef26397c9a6a3afee9c857c5e6f3317.svg' 
	}
}

const template = fs.readFileSync('./pages/HPL.html', 'utf8');

module.exports = () => {
	return new Promise((finalResolve, finalReject) => fs.readFile('../GAPI/credentials.json', (err, content) => {
		if (err) return finalReject('Error loading client secret file:' + err);
		authorize(JSON.parse(content), getSheet, ).then(([main, playoffs]) => {
			const board = {};
			Object.keys(teamValues).forEach(team => {
				if (team !== 'null') board[team] = [0, 0, 0, 0, 0]; // Score / Diff / W / D / L
			});
			const scheduled = [];
			Promise.all([main, playoffs].map(type => Promise.all(Object.keys(type).map((title, index) => {
				let latest = false;
				return new Promise((resolve, reject) => {
					const week = type[title];
					if (main === type) {
						week.forEach(set => {
							if (!Object.values(set.matches).every(match => match.score[0] + match.score[1])) return;
							if (set.scores[0] === set.scores[1]) {
								if (set.scores[0]) set.teams.forEach(team => {
									board[toID(team)][0] += 1;
									board[toID(team)][3]++;
								});
							}
							else {
								const winner = toID(set.scores[0] > set.scores[1] ? set.teams[0] : set.teams[1]), loser = toID(set.scores[0] < set.scores[1] ? set.teams[0] : set.teams[1])
								board[winner][0] += 2;
								board[winner][2]++;
								board[loser][4]++;
							}
							board[toID(set.teams[0])][1] += set.scores[0] - set.scores[1];
							board[toID(set.teams[1])][1] += set.scores[1] - set.scores[0];
						});
						const wSc = scheduled[index] = [];
						function timeLeft (match) {
							if (Array.isArray(match.linkCol) || match.linkCol[0] === '<') return;
							let [day, time] = match.linkCol.split(/(?<=Sun|Mon|Tue|Wed|Thu|Fri|Sat) /);
							time = time.replace(/\d{1,2}:\d{2} ?/, m => m.trim() + ':00 ');
							const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
							let targetDay = new Date(new Date().toLocaleString('GMT', {timeZone: 'Asia/Kolkata'}));
							targetDay.setDate(targetDay.getDate() + (7 - targetDay.getDay() + days.indexOf(day)) % 7);
							const targetDate = new Date(`${targetDay.toLocaleDateString()}, ${time}`);
							return targetDate.getTime();
						}
						if (!latest) {
							let noLineup = false;
							week.forEach(pair => Object.entries(pair.matches).forEach(([tier, match]) => {
								const time = timeLeft(match);
								if (!time) return;
								wSc.push({
									time,
									match: tier,
									schedule: match.linkCol,
									players: match.players,
									teams: pair.teams
								});
								if (!match.players[0]) noLineup = true;
							}));
							if (!noLineup) latest = true;
							else scheduled.push(wSc);
						}
					}
					let genned = template.replace(/{TITLE}/g, title).replace(/{TABLES}/g, week.map(set => `<table><tr><th colspan="6" style="background: ${teamValues[toID(set.teams[0])].color}; color: ${teamValues[toID(set.teams[0])].text};"><img src="${teamValues[toID(set.teams[0])].logo}" height="30" width="30" style="vertical-align: middle;" /> ${set.teams[0]} (${set.scores[0]})</th><th class="vs">vs</th><th colspan="6" style="background: ${teamValues[toID(set.teams[1])].color}; color: ${teamValues[toID(set.teams[1])].text};"><img src="${teamValues[toID(set.teams[1])].logo}" height="30" width="30" style="vertical-align: middle;" /> ${set.teams[1]} (${set.scores[1]})</th></tr><tr>${Array(13).fill('<td class="hidden"> </td>').join('')}</tr>${Object.keys(set.matches).map(tier => `<tr><td class="tier" colspan="2">${tier}</td><td class="player" colspan="4">${tools.colourize(set.matches[tier].players[0] || '')}</td><td class="vs">${set.matches[tier].score[0]}-${set.matches[tier].score[1]}</td><td class="player" colspan="4">${tools.colourize(set.matches[tier].players[1] || '')}</td><td class="matches" colspan="2">${Array.isArray(set.matches[tier].linkCol) ? set.matches[tier].linkCol.map((link, num) => `<a href="${link}" target="_blank"><button>${num + 1}</button></a>`).join('') : `<small style="color: white; font-size: 0.8em;">${set.matches[tier].linkCol}</small>`}</td></tr>`).join('')}</table>`).join('<br/><br/>'));
					fs.writeFile(`./pages/hindi/hpl-2021/${toID(title)}.html`, genned, err => {
						if (err) reject(err);
						else resolve(title);
					});
				});
			})))).then(res => {
				let boardHTML = `<center><table><tr><th style="width:280px;">Team</th><th style="width:45px;font-size:0.7em;">Score</th><th style="width:45px;font-size:0.7em;">Diff</th></tr>${Object.keys(board).sort((a, b) => a > b ? 1 : -1).sort((a, b) => board[b][1] - board[a][1]).sort((a, b) => board[b][0] - board[a][0]).map(team => `<tr><td style="background-color:${teamValues[team].color};color:${teamValues[team].text};font-weight:bold;text-align: center;"><img src="${teamValues[team].logo}" height="30" width="30" style="vertical-align: middle;"/> ${teamValues[team].name}</td><td style="text-align:center;font-weight:bold;font-size:1.2em;" title="${board[team].slice(2, 5).join('/')}">${board[team][0]}</td><td style="text-align:center;font-weight:bold;font-size:1.2em;">${board[team][1]}</td></tr>`).join('')}</table></center>`;
				fs.readFile('./pages/HPLBOARD.html', 'utf8', (er, file) => {
					if (er) return finalReject(er);
					fs.writeFile('./pages/hindi/hpl-2021/board.html', file.replace(/{BOARD}/g, boardHTML).replace(/{FOOTER}/g, res[0].map(week => `<a href="/hpl-2021/${toID(week)}" target="_blank">${week}</a>`).join('&nbsp;')), err => {
						if (err) return finalReject(err);
						fs.writeFile('./data/DATA/hplboard.html', boardHTML, e => {
							if (e) return finalReject(e);
							while (scheduled.length && scheduled[scheduled.length - 1].length === 0) scheduled.pop();
							const schedule = scheduled ? scheduled.pop() : [];
							fs.writeFile('./data/DATA/scheduled.json', JSON.stringify({teamValues, schedule}), error => {
								if (error) return finalReject(error);
								finalResolve(res.flat());
							});
						});
					});
				});
			}).catch(finalReject);
		});
	}));
}

function authorize (credentials, callback, ...args) {
	return new Promise ((resolve, reject) => {
		const {client_secret, client_id, redirect_uris} = credentials.installed;
		const oAuth2Client = new google.auth.OAuth2(
				client_id, client_secret, redirect_uris[0]);

		fs.readFile(TOKEN_PATH, (err, token) => {
			if (err) return reject(getNewToken(oAuth2Client, callback));
			oAuth2Client.setCredentials(JSON.parse(token));
			callback(oAuth2Client, ...args).then(resolve).catch(reject);
		});
	});
}

function getNewToken (oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error while trying to retrieve access token', err);
			oAuth2Client.setCredentials(token);
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
}

function getSheet (auth, contexts) {
	return Promise.all(contexts.map(context => {
		return new Promise((resolve, reject) => {
			const sheets = google.sheets({version: 'v4', auth});
			sheets.spreadsheets.values.get(context, (err, res) => {
				if (err) return reject('The API returned an error: ' + err);
				const rows = res.data.values;
				try {
					const sheetText = rows.map(row => row.join('\t')).join('\n');
					let HPL = {};
					sheetText.split('\n-\t-\t-\t-\t-\t-\n').forEach((weekText, weekNumber) => {
						weekNumber++;
						const label = weekText.match(/^[^\t]*?(?=\t)/)[0];
						HPL[label] = [];
						const week = HPL[label];
						weekText.split(/\n\t*\n/).forEach(pair => {
							const lines = pair.split('\n');
							const matchup = {
								teams: [],
								matches: {},
								scores: [0, 0]
							}
							matchup.teams = lines.shift().split('\t').slice(1, 3);
							lines.forEach(line => {
								const cells = line.split('\t');
								const tier = cells.shift();
								if (tier === 'constructor') throw new Error ('...who put constructor as a tier');
								matchup.matches[tier] = {
									players: [cells.shift(), cells.shift()],
									score: (cells[1]?.split('-').map(num => ~~num) || [0, 0]),
									linkCol: ((cells[2] === 'dead' ? '<small>-</small>' : cells[2]?.split(/\s*,\s*/)) || cells[0] || '<span style="font-size: 0.6em;">Not scheduled</small>')
								}
								if (matchup.matches[tier].score[0] !== matchup.matches[tier].score[1]) matchup.scores[Number(matchup.matches[tier].score[1] > matchup.matches[tier].score[0])]++;
							});
							week.push(matchup);
						});
					});
					resolve(HPL);
				} catch (e) {
					reject(e);
				}
			});
		});
	}));
}