class Othello {
	constructor (room, restore) {
		this.room = room.toLowerCase().replace(/[^a-z0-9-]/g, '');
		this.board = Array.from({length: 8}).map(row => Array.from({length: 8}).map(cell => 0));
		this.board[3][3] = this.board[4][4] = 'W';
		this.board[3][4] = this.board[4][3] = 'B';
		this.W = {
			name: '',
			player: ''
		}
		this.B = {
			name: '',
			player: ''
		}
		this.turn = null;
		this.started = false;
		if (restore) Object.keys(restore).forEach(key => this[key] = restore[key]);
	}
	other () {
		switch (this.turn) {
			case 'W': return 'B';
			case 'B': return 'W';
			default: return null;
		}
	}
	display () {
		let str = '<center><table style="border-collapse:collapse;" border="1px solid black;">';
		for (let i = 0; i < 8; i++) {
			str += `<tr style="height: 35px;">`;
			for (let j = 0; j < 8; j++) {
				str += `<td style="width: 35px; background-color: green; vertical-align: middle; horizontal-align: center; text-align: center;">${this.board[i][j] ? `<span style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid black; display: inline-block; margin: auto; vertical-align: middle; background-color: ${this.board[i][j] === 'W' ? 'white' : 'black'};"></span>` : `<button style="height: 35px; width: 35px; border: none; background: transparent;" name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${this.room} click ${i},${j}"></button>`}</td>`;
			}
			str += `</tr>`;
		}
		str += '</table></center>';
		return str;
	}
	start () {
		if (!this.W.player || !this.B.player) return null;
		this.turn = 'B';
		this.started = true;
		return true;
	}
	nextTurn (idled) {
		this.turn = this.other();
		let canPlay = false;
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (this.canPlay(i, j)) {
					canPlay = true;
					break;
				}
			}
			if (canPlay) break;
		}
		if (!canPlay) {
			if (idled) return this.end();
			else return this.nextTurn(true);
		}
		return this.turn;
	}
	count (board) {
		if (!board) board = this.board;
		let out = {W: 0, B: 0};
		Object.values(board).forEach(row => row.forEach(cell => {
			switch (cell) {
				case 'W': out.W++; break;
				case 'B': out.B++; break;
				default: break;
			}
		}));
		return out;
	}
	canPlay (i, j) {
		if (!this.turn || typeof i !== 'number' || typeof j !== 'number') return null;
		if (i >= 8 || j >= 8 || i < 0 || j < 0) return null;
		if (this.board[i][j]) return null;
		let board = JSON.parse(JSON.stringify(this.board));
		this.play(i, j, board);
		let [count, nCount] = [this.count(this.board), this.count(board)];
		if (count[this.other()] > nCount[this.other()]) return true;
		return false;
	}
	play (i, j, board) {
		if (!board) board = this.board;
		if (board[i][j]) return null;
		board[i][j] = this.turn;
		for (let m = i, n = j; m < 8 && n < 8 && m >= 0 && n >= 0; m++, n) {
			if (m === i && n === j) continue;
			if (!board[m][n]) break;
			if (board[m][n] !== this.turn) continue;
			for (let x = i, y = j; x < 8 && y < 8 && x >= 0 && y >= 0; x++, y) {
				if (x === i && y === j) continue;
				if (board[x][y] === this.other()) board[x][y] = this.turn;
				else break;
			}
			break;
		}
		for (let m = i, n = j; m < 8 && n < 8 && m >= 0 && n >= 0; m--, n) {
			if (m === i && n === j) continue;
			if (!board[m][n]) break;
			if (board[m][n] !== this.turn) continue;
			for (let x = i, y = j; x < 8 && y < 8 && x >= 0 && y >= 0; x--, y) {
				if (x === i && y === j) continue;
				if (board[x][y] === this.other()) board[x][y] = this.turn;
				else break;
			}
			break;
		}
		for (let m = i, n = j; m < 8 && n < 8 && m >= 0 && n >= 0; m, n++) {
			if (m === i && n === j) continue;
			if (!board[m][n]) break;
			if (board[m][n] !== this.turn) continue;
			for (let x = i, y = j; x < 8 && y < 8 && x >= 0 && y >= 0; x, y++) {
				if (x === i && y === j) continue;
				if (board[x][y] === this.other()) board[x][y] = this.turn;
				else break;
			}
			break;
		}
		for (let m = i, n = j; m < 8 && n < 8 && m >= 0 && n >= 0; m, n--) {
			if (m === i && n === j) continue;
			if (!board[m][n]) break;
			if (board[m][n] !== this.turn) continue;
			for (let x = i, y = j; x < 8 && y < 8 && x >= 0 && y >= 0; x, y--) {
				if (x === i && y === j) continue;
				if (board[x][y] === this.other()) board[x][y] = this.turn;
				else break;
			}
			break;
		}
		for (let m = i, n = j; m < 8 && n < 8 && m >= 0 && n >= 0; m++, n++) {
			if (m === i && n === j) continue;
			if (!board[m][n]) break;
			if (board[m][n] !== this.turn) continue;
			for (let x = i, y = j; x < 8 && y < 8 && x >= 0 && y >= 0; x++, y++) {
				if (x === i && y === j) continue;
				if (board[x][y] === this.other()) board[x][y] = this.turn;
				else break;
			}
			break;
		}
		for (let m = i, n = j; m < 8 && n < 8 && m >= 0 && n >= 0; m--, n++) {
			if (m === i && n === j) continue;
			if (!board[m][n]) break;
			if (board[m][n] !== this.turn) continue;
			for (let x = i, y = j; x < 8 && y < 8 && x >= 0 && y >= 0; x--, y++) {
				if (x === i && y === j) continue;
				if (board[x][y] === this.other()) board[x][y] = this.turn;
				else break;
			}
			break;
		}
		for (let m = i, n = j; m < 8 && n < 8 && m >= 0 && n >= 0; m++, n--) {
			if (m === i && n === j) continue;
			if (!board[m][n]) break;
			if (board[m][n] !== this.turn) continue;
			for (let x = i, y = j; x < 8 && y < 8 && x >= 0 && y >= 0; x++, y--) {
				if (x === i && y === j) continue;
				if (board[x][y] === this.other()) board[x][y] = this.turn;
				else break;
			}
			break;
		}
		for (let m = i, n = j; m < 8 && n < 8 && m >= 0 && n >= 0; m--, n--) {
			if (m === i && n === j) continue;
			if (!board[m][n]) break;
			if (board[m][n] !== this.turn) continue;
			for (let x = i, y = j; x < 8 && y < 8 && x >= 0 && y >= 0; x--, y--) {
				if (x === i && y === j) continue;
				if (board[x][y] === this.other()) board[x][y] = this.turn;
				else break;
			}
			break;
		}
		return board;
	}
	end () {
		this.started = null;
		let W = 0, B = 0;
		this.board.forEach(row => row.forEach(cell => {
			switch (cell) {
				case 'W': return W++;
				case 'B': return B++;
				default: return;
			}
		}));
		this.winner = W > B ? 'W' : 'B';
		if (W === B) this.winner = 'O';
		return JSON.stringify(this);
	}
}

exports.Othello = Othello;