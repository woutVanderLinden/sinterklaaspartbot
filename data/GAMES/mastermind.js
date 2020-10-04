class Mastermind {
	constructor (room, user, guessLimit) {
		this.name = user.replace(/^[^a-z0-9A-Z]/, '');
		this.player = toId(user);
		this.guessLimit = guessLimit || 10;
		this.room = room;
		this.colours = [
			{
				colour: "white",
				text: "black",
				index: 0
			},
			{
				colour: "red",
				text: "white",
				index: 1
			},
			{
				colour: "orange",
				text: "black",
				index: 2
			},
			{
				colour: "yellow",
				text: "black",
				index: 3
			},
			{
				colour: "green",
				text: "white",
				index: 4
			},
			{
				colour: "blue",
				text: "white",
				index: 5
			},
			{
				colour: "purple",
				text: "white",
				index: 6
			},
			{
				colour: "pink",
				text: "black",
				index: 7
			}
		]
		this.sol = Array.from({length: 4}).map(t => Math.floor(Math.random() * 8));
		this.guesses = [];
		this.spectators = [];
	}
	guess (input) {
		let self = this;
		return new Promise ((resolve, reject) => {
			if (!Array.isArray(input)) input = String(input).replace(/[^0-7]/g, '').split('');
			input = input.map(num => parseInt(num));
			if (input.length !== 4) return reject("Guess must be 4 numbers long!");
			let sol = JSON.parse(JSON.stringify(self.sol)), guess = JSON.parse(JSON.stringify(input)), hits = [], close = 0;
			for (let i = 0; i < 4; i++) {
				if (sol[i] === guess[i]) hits.push(i);
			}
			sol = sol.filter((t, i) => !hits.includes(i)).sort((a, b) => a - b);
			guess = guess.filter((t, i) => !hits.includes(i)).sort((a, b) => a - b);
			for (let i = 0; i < sol.length; i++) {
				while (sol.includes(guess[i])) {
					sol.remove(guess[i]);
					guess.remove(guess[i]);
					close++;
				}
			}
			let temp = self.guesses.pop();
			if (temp && temp[4][0] !== null) self.guesses.push(temp);
			self.guesses.push([...input, [hits.length, close]]);
			if (hits.length === 4) return resolve(1);
			if (self.guesses.length >= self.guessLimit) return resolve(2);
			return resolve(0);
		});
	}
	type (num) {
		num = parseInt(num);
		if (typeof num !== 'number') return null;
		if (num < 0 || num > 7) return null;
		let lastGuess = this.guesses[this.guesses.length - 1];
		if (!lastGuess || (lastGuess[4] && lastGuess[4][0] !== null)) {
			this.guesses.push([null, null, null, null, [null]]);
			lastGuess = this.guesses[this.guesses.length - 1];
		}
		for (let i = 0; i < 4; i++) {
			if (lastGuess[i] !== null && i !== 3) continue;
			lastGuess[i] = num;
			break;
		}
		return true;
	}
	backspace () {
		let lastGuess = this.guesses[this.guesses.length - 1];
		if (!lastGuess || lastGuess[4][0] !== null) return false;
		for (let i = 0; i < 4; i++) {
			if (lastGuess[i] === null) {
				lastGuess[i - 1] = null;
				return true;
			}
		}
		lastGuess[3] = null;
		return true;
	}
	boardHTML (player) {
		const scale = 3.5;
		let html = `<div style="margin-left: 50px; margin-top: 20px; width: ${76 * scale};"><div style="margin: auto; width: ${76 * scale}px; background: #222222; border: 2px solid black; margin-top: 5px; display: inline-block;">`;
		html += `<div style="margin-left: ${5 * scale}px; margin-right: ${22 * scale}px; margin-top: ${4 * scale}px; margin-bottom: ${4 * scale}px; background: #111111; border: 1px solid black; font-size: ${0.5 * scale}em; font-weight: bold; color: red; text-align: center; display: table;">${Array.from({length: 4}).map(t => `<div style="display: table-cell; width: ${10 * scale}px; height: ${10 * scale}px; margin-left: margin-right: ${2  *scale}px; vertical-align: middle;">?</div>`).join('')}</div>`;
		for (let i = (this.guessLimit - 1); i >= 0; i--) {
			html += `<hr style="color: black; padding-top: padding-bottom: ${2 * scale}px; margin-left: margin-right: ${5 * scale}px;">`;
			html += `<div style="display: inline-block; margin-top: ${2 * scale}; margin-bottom: ${2 * scale}px; height: ${10 * scale}px; vertical-align: middle; text-align: left;">${(this.guesses[i] || [null, null, null, null, [null]]).slice(0, 4).map((n, index) => {
				if (typeof n !== 'number') return `<div style="display: inline-block; margin-left: ${2 * scale}px; margin-right: ${2 *scale}px; margin-top: margin-bottom: ${2 * scale}px; width: ${10 * scale}px; height: ${10 * scale}px; border-radius: 50%; background: none; vertical-align: middle;">&nbsp;</div>`;
				else return `<div style="display: inline-block; margin-left: ${2 * scale}px; margin-right: ${2 *scale}px; width: ${10 * scale}px; height: ${10 * scale}px; border-radius: 50%; color: ${this.colours[n].text}; background: ${this.colours[n].colour}; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">${n}</div>`;
			}).join('')}</div><div style="display: inline-block; padding-left: padding-right: 5px;">${(this.guesses[i] || [null, null, null, null, [null]]).slice(4, 5).map(n => {
				if (typeof n[0] !== 'number') return `<div style="width: ${14 * scale}px; display: inline-block;"></div>`;
				let out = '';
				out += Array.from({length: n[0]}).map(t => `<div style="width: ${3 * scale}px; height: ${3 * scale}px; background: #E60000; vertical-align: middle; display: inline-block; border-radius: 50%; border: 0.5px solid black; text-align: center; margin-left: margin-right: ${2 * scale}px;"><div style="height: 40%; width: 40%; top: 30%; left: 30%; border-radius: 50%; border: none; background: #800000; position: relative;"></div></div>`).join('');
				out += Array.from({length: n[1]}).map(t => `<div style="width: ${3 * scale}px; height: ${3 * scale}px; background: white; vertical-align: middle; display: inline-block; border-radius: 50%; border: 0.5px solid black; text-align: center; margin-left: margin-right: ${2 * scale}px;"><div style="height: 40%; width: 40%; top: 30%; left: 30%; border-radius: 50%; border: none; background: #B3B3B3; position: relative;"></div></div>`).join('');
				out += Array.from({length: (4 - n[0] - n[1])}).map(t => `<div style="width: ${3 * scale}px; height: ${3 * scale}px; background: none; vertical-align: middle; display: inline-block; border-radius: 50%; border: none; text-align: center; margin-left: margin-right: ${2 * scale}px;"><div style="height: 40%; width: 40%; top: 30%; left: 30%; border-radius: 50%; border: 1px solid black; background: #4D4D4D; position: relative;"></div></div>`).join('');
				return out;
			}).join('%%')}</div>`;
		}
		html += `</div>${player ? `<div style="border: none; vertical-align: top; height: 100%; background: none; width: 320px; display: inline-block;"><div style="border: 1px solid; margin-top: 40px; margin-left: 20px; background: #222222;"><div style="padding: ${5 * scale}px;"><div style="display: inline-block; margin-top: 7; margin-bottom: 7px; height: 35px; vertical-align: middle; text-align: left;"><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}mastermind ${this.room} type 0" style="border: none; background: none;"><div style="display: inline-block; margin-left: 3px; margin-right: 3px; width: 35px; height: 35px; border-radius: 50%; color: black; background: white; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">0</div></button><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}mastermind ${this.room} type 1" style="border: none; background: none;"><div style="display: inline-block; margin-left: 3px; margin-right: 3px; width: 35px; height: 35px; border-radius: 50%; color: white; background: red; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">1</div></button><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}mastermind ${this.room} type 2" style="border: none; background: none;"><div style="display: inline-block; margin-left: 3px; margin-right: 3px; width: 35px; height: 35px; border-radius: 50%; color: black; background: orange; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">2</div></button><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}mastermind ${this.room} type 3" style="border: none; background: none;"><div style="display: inline-block; margin-left: 3px; margin-right: 3px; width: 35px; height: 35px; border-radius: 50%; color: black; background: yellow; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">3</div></button></div><br /><div style="display: inline-block; margin-top: 7; margin-bottom: 7px; height: 35px; vertical-align: middle; text-align: left;"><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}mastermind ${this.room} type 4" style="border: none; background: none;"><div style="display: inline-block; margin-left: 3px; margin-right: 3px; width: 35px; height: 35px; border-radius: 50%; color: white; background: green; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">4</div></button><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}mastermind ${this.room} type 5" style="border: none; background: none;"><div style="display: inline-block; margin-left: 3px; margin-right: 3px; width: 35px; height: 35px; border-radius: 50%; color: white; background: blue; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">5</div></button><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}mastermind ${this.room} type 6" style="border: none; background: none;"><div style="display: inline-block; margin-left: 3px; margin-right: 3px; width: 35px; height: 35px; border-radius: 50%; color: white; background: purple; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">6</div></button><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}mastermind ${this.room} type 7" style="border: none; background: none;"><div style="display: inline-block; margin-left: 3px; margin-right: 3px; width: 35px; height: 35px; border-radius: 50%; color: black; background: pink; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">7</div></button></div><br /><div style="display: inline-block; margin-top: 7; margin-bottom: 7px; height: 35px; vertical-align: middle; text-align: left;"><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}mastermind ${this.room} backspace" style="border: none; background: none;"><div style="display: inline-block; margin-left: 3px; margin-right: 3px; width: 100px; height: 35px; color: red; background: white; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">&#9003;</div></button><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}mastermind ${this.room} guess ${this.guesses[this.guesses.length - 1] ? this.guesses[this.guesses.length - 1].slice(0, 4).join('') : ''}"${this.guesses[this.guesses.length - 1] && typeof this.guesses[this.guesses.length - 1][3] === 'number' && this.guesses[this.guesses.length - 1][4][0] === null ? '' : ' disabled'} style="border: none; background: none;"><div style="display: inline-block; margin-left: 3px; margin-right: 3px; width: 100px; height: 35px; color: black; background: white; font-weight: bold; font-size: 1.8em; text-align: center; border: 1px solid black; position: relative; float: left;">GO</div></button></div></div></div></div>` : ''}</div>`;
		return html;
	}
	sendPages () {
		let list = JSON.parse(JSON.stringify(this.spectators));
		list.unshift(this.player);
		let spacer = () => {
			if (list.length) Bot.say(this.room, `/sendhtmlpage ${list[0]}, Mastermind + ${this.room} + ${this.player}, ${this.boardHTML(list.shift() === this.player)}`);
			setTimeout(spacer, 500);
		}
		spacer();
		return;
	}
}

exports.Mastermind = Mastermind;
