class LO {
	constructor (room, user, size) {
		this.name = user;
		this.user = toId(user);
		this.room = room.toLowerCase().replace(/[^a-z0-9-]/g, '');
		this.size = size || [5, 5];
		this.board = Array.from({length: size[0]}).map(row => Array.from({length: size[1]}).map(t => 0));
		this.soln = [];
		this.moves = [];
		this.spectators = [];
		for (let i = 0; i < size[0]; i++) {
			for (let j = 0; j < size[1]; j++) {
				if (Math.random() < 0.5 || (this.soln.length === 0 && i === size[0] - 1 && j === size[1] - 1)) this.soln.push([i, j]);
			}
		}
		this.click = (a, b) => {
			if (!(a < this.size[0] && a >= 0 && b < this.size[1] && b >= 0)) return null;
			this.board[a][b] = this.board[a][b] ? 0 : 1;
			if (a) this.board[a - 1][b] = this.board[a - 1][b] ? 0 : 1;
			if (b) this.board[a][b - 1] = this.board[a][b - 1] ? 0 : 1;
			if (a + 1 < this.size[0]) this.board[a + 1][b] = this.board[a + 1][b] ? 0 : 1;
			if (b + 1 < this.size[1]) this.board[a][b + 1] = this.board[a][b + 1] ? 0 : 1;
			this.moves.push([a, b]);
			if (!this.board.reduce((a, b) => a + b.reduce((c, d) => c+ d, 0), 0)) return true;
			return false;
		}
		this.soln.forEach(pair => this.click(...pair));
		this.moves = [];
		this.problem = JSON.parse(JSON.stringify(this.board));
	}
	boardHTML (isPlayer, board) {
		let colours = ["#6e6d62", "#fff9ba", "#111111"];
		let html = `<center><table style="border:none;background:${colours[2]}">${(board || this.board).map((row, x) => `<tr>${row.map((bulb, y) => `<td>${isPlayer ? `<button name="send" value="/pm ${Bot.status.nickName},${prefix}lo ${this.room}, c ${x} ${y}" style="background:none;border:none;padding:0">` : ''}<div style="height:${board ? '20' : '35'}px;width:${board ? '20': '35'}px;background-image:radial-gradient(${colours[bulb]} 60%,#333333);border-radius:${board ? '5' : '10'}px;margin:${board ? '2' : '3'}px"></div>${isPlayer ? '</button>' : ''}</td>`).join('')}</tr>`).join('')}</table></center>`;
		return html;
	}
}

exports.LO = LO;