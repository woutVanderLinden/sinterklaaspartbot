class ConnectFour {
	constructor (id, info, room, restore) {
		this.id = id;
		info.rows = parseInt(info.rows);
		if (info.rows > 10 || info.rows < 5 || !info.rows) info.rows = 6;
		info.cols = parseInt(info.cols);
		if (info.cols > 10 || info.cols < 5 || !info.cols) info.cols = 7;
		this.rows = info.rows;
		this.cols = info.cols;
		this.turn = 'Y';
		this.room = room;
		this.Y = {
			id: '',
			name: '',
		};
		this.R = {
			id: '',
			name: '',
		};
		this.board = Array.from({length: this.cols}).map(() => []);
		this.spectators = [];
		this.moves = [];
		this.started = false;
		if (restore) Object.keys(restore).forEach(key => this[key] = restore[key]);
	}
	nextTurn (last) {
		let win = this.isWon(this.board, last);
		if (win) return win;
		this.turn = this.turn === 'Y' ? 'R' : 'Y';
		return false;
	}
	drop (col) {
		return new Promise ((resolve, reject) => {
			col = parseInt(col);
			if (!(col >= 0 && col < this.cols)) return reject('Column does not exist');
			if (this.board[col].length === this.rows) return reject('Column is full');
			this.board[col].push(this.turn);
			this.moves.push(col);
			return resolve(this.nextTurn(col));
		});
	}
	isWon (board, col) {
		if (!board) board = this.board;
		let row = this.board[col].length - 1, j;
		// Vertical
		for (let j = Math.max(row - 3, 0); j <= Math.min(this.rows - 4, row); j++) if (this.board[col][j] === this.turn && this.board[col][j + 1] === this.turn && this.board[col][j + 2] === this.turn && this.board[col][j + 3] === this.turn) return this.turn;
		// Horizontal
		for (let j = Math.max(col - 3, 0); j <= Math.min(this.cols - 4, col); j++) if (this.board[j][row] === this.turn && this.board[j + 1][row] === this.turn && this.board[j + 2][row] === this.turn && this.board[j + 3][row] === this.turn) return this.turn;
		// Ascending
		j = [col - 3, row - 3];
		while (j[0] < 0 || j[1] < 0) [j[0]++, j[1]++];
		for (; j[0] <= Math.min(this.cols - 4, col) && j[1] <= Math.min(this.rows - 4, row); j[0]++, j[1]++) if (this.board[j[0]][j[1]] === this.turn && this.board[j[0] + 1][j[1] + 1] === this.turn && this.board[j[0] + 2][j[1] + 2] === this.turn && this.board[j[0] + 3][j[1] + 3] === this.turn) return this.turn;
		// Descending
		j = [col - 3, row + 3];
		while (j[0] < 0 || j[1] >= this.rows) [j[0]++, j[1]--];
		for (; j[0] <= Math.min(this.cols - 4, col) && j[1] >= Math.max(row - 3, 3); j[0]++, j[1]--) if (this.board[j[0]][j[1]] === this.turn && this.board[j[0] + 1][j[1] - 1] === this.turn && this.board[j[0] + 2][j[1] - 2] === this.turn && this.board[j[0] + 3][j[1] - 3] === this.turn) return this.turn;
		return false;
	}
	boardHTML (player, passed) {
		let colours = {'Y': "#ffff00", 'R': "#e60000", 'E': "#111111", 'bg': "#0080ff"};
		let board = Array.from({length: this.cols}).map((col, x) => Array.from({length: this.rows}).map((_, y) => this.board[x][y] || 'E'));
		board.forEach(col => col.reverse());
		let html = `<center style="max-height: 400px; overflow-y: scroll;"><table style="border:none;background:${colours.bg};border-radius:5%;">${board[0].map((col, i) => board.map(row => row[i])).map((row) => `<tr>${row.map((bulb, y) => `<td>${player ? `<button name="send" value="/msgroom ${this.room},/botmsg ${Bot.status.nickName},${prefix}connectfour ${this.room} click ${this.id} ${y}" style="background:none;border:none;padding:0">` : ''}<div style="height:${passed ? '15' : '35'}px;width:${passed ? '15': '35'}px;background-image:radial-gradient(${colours[bulb]} 50%,#333333);border-radius:50%;margin:${passed ? '1.5' : '3'}px"></div>${player ? '</button>' : ''}</td>`).join('')}</tr>`).join('')}</table></center>`;
		return html;
	}
}

module.exports = ConnectFour;