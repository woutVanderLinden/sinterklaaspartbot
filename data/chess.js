class Chess {
	constructor (id, restore) {
		this.id = id;
		this.started = false;
		this.W = {
			player: null,
			name: null,
			Km: false,
			Ram: false,
			Rhm: false,
			captures: [],
			isPromoting: false
		};
		this.B = {
			player: null,
			name: null,
			Km: false,
			Ram: false,
			Rhm: false,
			captures: [],
			isPromoting: false
		};
		this.moves = [];
		this.lastMoveP2 = false;
		this.board = {};
		['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(file => this.board[file] = ['', '', '', '', '', '', '', '', '']);
		// pieces are saved as BN, WP, WQ, etc.
		this.turn = 'W';
		if (restore) Object.keys(restore).forEach(key => this[key] = restore[key]);
		this.imgsrc = {
			WK: '<IMG src="https://i.ibb.co/VMdPRNv/tile000.png" height="25" width="25" style="height: 25; width="25"/>',
			WQ: '<IMG src="https://i.ibb.co/pd41dph/tile001.png" height="25" width="25" style="height: 25; width="25"/>',
			WB: '<IMG src="https://i.ibb.co/rpXcgJZ/tile002.png" height="25" width="25" style="height: 25; width="25"/>',
			WN: '<IMG src="https://i.ibb.co/pJTwBHC/tile003.png" height="25" width="25" style="height: 25; width="25"/>',
			WR: '<IMG src="https://i.ibb.co/wSLmztb/tile004.png" height="25" width="25" style="height: 25; width="25"/>',
			WP: '<IMG src="https://i.ibb.co/nnBGJ39/tile005.png" height="25" width="25" style="height: 25; width="25"/>',
			BK: '<IMG src="https://i.ibb.co/x2yqdbQ/tile006.png" height="25" width="25" style="height: 25; width="25"/>',
			BQ: '<IMG src="https://i.ibb.co/2ZGbCgs/tile007.png" height="25" width="25" style="height: 25; width="25"/>',
			BB: '<IMG src="https://i.ibb.co/M6rq9zZ/tile008.png" height="25" width="25" style="height: 25; width="25"/>',
			BN: '<IMG src="https://i.ibb.co/bXdF1Rg/tile009.png" height="25" width="25" style="height: 25; width="25"/>',
			BR: '<IMG src="https://i.ibb.co/1q1HKXQ/tile010.png" height="25" width="25" style="height: 25; width="25"/>',
			BP: '<IMG src="https://i.ibb.co/vzvCQnQ/tile011.png" height="25" width="25" style="height: 25; width="25"/>'
		}
		this.emosrc = {
			WK: '<DIV style="font-size:25px;">&#x2654;</DIV>',
			WQ: '<DIV style="font-size:25px;">&#x2655;</DIV>',
			WB: '<DIV style="font-size:25px;">&#x2657;</DIV>',
			WN: '<DIV style="font-size:25px;">&#x2658;</DIV>',
			WR: '<DIV style="font-size:25px;">&#x2656;</DIV>',
			WP: '<DIV style="font-size:25px;">&#x2659;</DIV>',
			BK: '<DIV style="font-size:25px;">&#x265A;</DIV>',
			BQ: '<DIV style="font-size:25px;">&#x265B;</DIV>',
			BB: '<DIV style="font-size:25px;">&#x265D;</DIV>',
			BN: '<DIV style="font-size:25px;">&#x265E;</DIV>',
			BR: '<DIV style="font-size:25px;">&#x265C;</DIV>',
			BP: '<DIV style="font-size:25px;">&#x265F;</DIV>'
		}
		this.colours = {
			'W': 'white',
			'B': '#9C5624',
			'sel': '#87CEFA',
			'hl': '#ADFF2F',
			'last': null
		}
	}
	increment (character) {
		switch (character) {
			case 'a': return 'b';
			case 'b': return 'c';
			case 'c': return 'd';
			case 'd': return 'e';
			case 'e': return 'f';
			case 'f': return 'g';
			case 'g': return 'h';
			default: return null;
		}
	}
	decrement (character) {
		switch (character) {
			case 'b': return 'a';
			case 'c': return 'b';
			case 'd': return 'c';
			case 'e': return 'd';
			case 'f': return 'e';
			case 'g': return 'f';
			case 'h': return 'g';
			default: return null;
		}
	}
	setBoard () {
		this.board.a[1] = 'WR';
		this.board.b[1] = 'WN';
		this.board.c[1] = 'WB';
		this.board.d[1] = 'WQ';
		this.board.e[1] = 'WK';
		this.board.f[1] = 'WB';
		this.board.g[1] = 'WN';
		this.board.h[1] = 'WR';

		this.board.a[2] = 'WP';
		this.board.b[2] = 'WP';
		this.board.c[2] = 'WP';
		this.board.d[2] = 'WP';
		this.board.e[2] = 'WP';
		this.board.f[2] = 'WP';
		this.board.g[2] = 'WP';
		this.board.h[2] = 'WP';


		this.board.a[8] = 'BR';
		this.board.b[8] = 'BN';
		this.board.c[8] = 'BB';
		this.board.d[8] = 'BQ';
		this.board.e[8] = 'BK';
		this.board.f[8] = 'BB';
		this.board.g[8] = 'BN';
		this.board.h[8] = 'BR';

		this.board.a[7] = 'BP';
		this.board.b[7] = 'BP';
		this.board.c[7] = 'BP';
		this.board.d[7] = 'BP';
		this.board.e[7] = 'BP';
		this.board.f[7] = 'BP';
		this.board.g[7] = 'BP';
		this.board.h[7] = 'BP';

		this.started = true;
	}
	switchSides () {
		this.turn = (this.turn === 'W' ? 'B' : 'W');
		return;
	}
	getPiece (square, board) {
		if (board) return board[square[0]][square[1]].split('');
		return this.board[square[0]][square[1]].split('');
	}
	adjFiles (file) {
		switch (file) {
			case 'a': return ['b'];
			case 'b': return ['a', 'c'];
			case 'c': return ['b', 'd'];
			case 'd': return ['c', 'e'];
			case 'e': return ['d', 'f'];
			case 'f': return ['e', 'g'];
			case 'g': return ['f', 'h'];
			case 'h': return ['g'];
			default: return [];
		}
	}
	knightSquares (file, rank) {
		rank = parseInt(String(rank));
		let ranks1 = [], ranks2 = [], files1 = this.adjFiles(file), files2, squares = [];
		if (rank + 1 < 9) ranks1.push(rank + 1);
		if (rank + 2 < 9) ranks2.push(rank + 2);
		if (rank - 1 > 0) ranks1.push(rank - 1);
		if (rank - 2 > 0) ranks2.push(rank - 2);
		switch (file) {
			case 'a': {
				files2 = ['c'];
				break;
			}
			case 'b': {
				files2 = ['d'];
				break;
			}
			case 'c': {
				files2 = ['a', 'e'];
				break;
			}
			case 'd': {
				files2 = ['b', 'f'];
				break;
			}
			case 'e': {
				files2 = ['c', 'g'];
				break;
			}
			case 'f': {
				files2 = ['d', 'h'];
				break;
			}
			case 'g': {
				files2 = ['e'];
				break;
			}
			case 'h': {
				files2 = ['f'];
				break;
			}
			default: break;
		}
		ranks1.forEach(grank => {
			files2.forEach(gfile =>{
				squares.push(gfile + grank);
			});
		});
		ranks2.forEach(grank => {
			files1.forEach(gfile =>{
				squares.push(gfile + grank);
			});
		});
		return squares;
	}
	getSquares (square, board) {
	    if (!board) board = this.board;
	    let recept = this.getPiece(square, board);
	    if (!(recept.length === 2)) return [];
	    let piece = recept[1], side = recept[0];
	    if (!piece);
	    square = [square[0], parseInt(square[1])];
	    let squares = [];
	    switch (piece) {
	      case 'P': {
	        switch (side) {
	          case 'W': {
	            if (square[1] < 8 && !board[square[0]][square[1] + 1]) squares.push(square[0] + (square[1] + 1));
	            if (square[1] === 2 && !board[square[0]][3] && !board[square[0]][4]) squares.push(square[0] + '4');
	            this.adjFiles(square[0]).forEach(file => {
	              if (board[file][square[1] + 1][0] === 'B') squares.push(file + (square[1] + 1));
	            });
	            break;
	          }
	          case 'B': {
	          if (square[1] === 7 && !board[square[0]][6] && !board[square[0]][5]) squares.push(square[0] + '5');
	            if (square[1] > 1 && !board[square[0]][square[1] - 1]) squares.push(square[0] + (square[1] - 1));
	            this.adjFiles(square[0]).forEach(file => {
	              if (board[file][square[1] - 1][0] === 'W') squares.push(file + (square[1] - 1));
	            });
	            break;
	          }
	          default: break;
	        }
	        break;
	      }
	      case 'K': {
	        let files = this.adjFiles(square[0]);
	        files.push(square[0]);
	        files.forEach(file => {
	          for (let i = -1; i < 2; i++) {
	            if ((square[1] + i < 9) && (square[1] + i > 0) && !(file === square[0] && !i) && (!board[file][square[1] + i] || !board[file][square[1] + i].startsWith(side))) squares.push(file + (square[1] + i));
	          }
	        });
	        break;
	      }
	      case 'R': {
	        for (let i = square[1] - 1; i > 0; i--) {
	          if (!board[square[0]][i]) {
	            squares.push(square[0] + i);
	            continue;
	          }
	          if (board[square[0]][i].startsWith(side)) break;
	          else {
	            squares.push(square[0] + i);
	            break;
	          }
	        }
	        for (let i = square[1] + 1; i < 9; i++) {
	          if (!board[square[0]][i]) {
	            squares.push(square[0] + i);
	            continue;
	          }
	          if (board[square[0]][i].startsWith(side)) break;
	          else {
	            squares.push(square[0] + i);
	            break;
	          }
	        }
	        for (let i = this.increment(square[0]); i; i = this.increment(i)) {
	          if (!board[i][square[1]]) {
	            squares.push(i + square[1]);
	            continue;
	          }
	          if (board[i][square[1]].startsWith(side)) break;
	          else {
	            squares.push(i + square[1]);
	            break;
	          }
	        }
	        for (let i = this.decrement(square[0]); i; i = this.decrement(i)) {
	          if (!board[i][square[1]]) {
	            squares.push(i + square[1]);
	            continue;
	          }
	          if (board[i][square[1]].startsWith(side)) break;
	          else {
	            squares.push(i + square[1]);
	            break;
	          }
	        }
	        break;
	      }
	      case 'N': {
	        squares = this.knightSquares(square[0], square[1]).filter(pos => !board[pos[0]][pos[1]].startsWith(side));
	        break;
	      }
	      case 'B': {
	        let j = 0;
	        for (let i = this.increment(square[0]); i && (square[1] + j < 8); i = this.increment(i)) {
	          if (!board[i][square[1] + ++j]) {
	            squares.push(i + (square[1] + j));
	            continue;
	          }
	          if (board[i][square[1] + j].startsWith(side)) break;
	          else {
	            squares.push(i + (square[1] + j));
	            break;
	          }
	        }
	        j = 0;
	        for (let i = this.increment(square[0]); i && (square[1] - j > 1); i = this.increment(i)) {
	          if (!board[i][square[1] - ++j]) {
	            squares.push(i + (square[1] - j));
	            continue;
	          }
	          if (board[i][square[1] - j].startsWith(side)) break;
	          else {
	            squares.push(i + (square[1] - j));
	            break;
	          }
	        }
	        j = 0;
	        for (let i = this.decrement(square[0]); i && (square[1] + j < 8); i = this.decrement(i)) {
	          if (!board[i][square[1] + ++j]) {
	            squares.push(i + (square[1] + j));
	            continue;
	          }
	          if (board[i][square[1] + j].startsWith(side)) break;
	          else {
	            squares.push(i + (square[1] + j));
	            break;
	          }
	        }
	        j = 0;
	        for (let i = this.decrement(square[0]); i && (square[1] - j > 1); i = this.decrement(i)) {
	          if (!board[i][square[1] - ++j]) {
	            squares.push(i + (square[1] - j));
	            continue;
	          }
	          if (board[i][square[1] - j].startsWith(side)) break;
	          else {
	            squares.push(i + (square[1] - j));
	            break;
	          }
	        }
	        break;
	      }
	      case 'Q': {
	        for (let i = square[1] - 1; i > 0; i--) {
	          if (!board[square[0]][i]) {
	            squares.push(square[0] + i);
	            continue;
	          }
	          if (board[square[0]][i].startsWith(side)) break;
	          else {
	            squares.push(square[0] + i);
	            break;
	          }
	        }
	        for (let i = square[1] + 1; i < 9; i++) {
	          if (!board[square[0]][i]) {
	            squares.push(square[0] + i);
	            continue;
	          }
	          if (board[square[0]][i].startsWith(side)) break;
	          else {
	            squares.push(square[0] + i);
	            break;
	          }
	        }
	        for (let i = this.increment(square[0]); i; i = this.increment(i)) {
	          if (!board[i][square[1]]) {
	            squares.push(i + square[1]);
	            continue;
	          }
	          if (board[i][square[1]].startsWith(side)) break;
	          else {
	            squares.push(i + square[1]);
	            break;
	          }
	        }
	        for (let i = this.decrement(square[0]); i; i = this.decrement(i)) {
	          if (!board[i][square[1]]) {
	            squares.push(i + square[1]);
	            continue;
	          }
	          if (board[i][square[1]].startsWith(side)) break;
	          else {
	            squares.push(i + square[1]);
	            break;
	          }
	        }
	        let j = 0;
	        for (let i = this.increment(square[0]); i && (square[1] + j < 8); i = this.increment(i)) {
	          if (!board[i][square[1] + ++j]) {
	            squares.push(i + (square[1] + j));
	            continue;
	          }
	          if (board[i][square[1] + j].startsWith(side)) break;
	          else {
	            squares.push(i + (square[1] + j));
	            break;
	          }
	        }
	        j = 0;
	        for (let i = this.increment(square[0]); i && (square[1] - j > 1); i = this.increment(i)) {
	          if (!board[i][square[1] - ++j]) {
	            squares.push(i + (square[1] - j));
	            continue;
	          }
	          if (board[i][square[1] - j].startsWith(side)) break;
	          else {
	            squares.push(i + (square[1] - j));
	            break;
	          }
	        }
	        j = 0;
	        for (let i = this.decrement(square[0]); i && (square[1] + j < 8); i = this.decrement(i)) {
	          if (!board[i][square[1] + ++j]) {
	            squares.push(i + (square[1] + j));
	            continue;
	          }
	          if (board[i][square[1] + j].startsWith(side)) break;
	          else {
	            squares.push(i + (square[1] + j));
	            break;
	          }
	        }
	        j = 0;
	        for (let i = this.decrement(square[0]); i && (square[1] - j > 1); i = this.decrement(i)) {
	          if (!board[i][square[1] - ++j]) {
	            squares.push(i + (square[1] - j));
	            continue;
	          }
	          if (board[i][square[1] - j].startsWith(side)) break;
	          else {
	            squares.push(i + (square[1] - j));
	            break;
	          }
	        }
	      	break;
	      }
	      default: {
	        return [piece];
	      }
	    }
	    return squares;
	}
	getLocationsOfPiecesAgainst (piece, final, board) {
		if (!board) board = this.board;
		if (Array.isArray(final)) final = final.join('');
		if (!/^[BW][PKQRBN]$/.test(piece)) return null;
		let out = [];
		Object.keys(board).forEach(l => {
			for (let i = 1; i < 9; i++) {
				if (board[l][i] == piece) out.push(l + i);
			}
		});
		return out.filter(loc => this.getSquares(loc, this.board).includes(final));
	}
	checkChecks (side, board) {
		if (!board) board = this.board;
		let kSquare = null, checkedSquares = [], flag = false;
		['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(file => {
			[1, 2, 3, 4, 5, 6, 7, 8].forEach(rank => {
				if (flag) return;
				let square = [file, rank];
				if (!board[file][rank]) return;
				if (side === board[file][rank][0]) {
					if (board[file][rank][1] === 'K') {
						kSquare = (file + rank);
						if (checkedSquares.includes(kSquare)) return flag = true;
					}
					return;
				}
				this.getSquares(file + rank, board).forEach(square => {
					if (!kSquare && !checkedSquares.includes(square)) checkedSquares.push(square);
					else {
						if (kSquare && square == kSquare) {
							flag = true;
						}
					}
				});
			});
		});
		return flag;
	}
	allValidMoves (side, board) {
		if (!board) board = this.board;
		let valids = [];
		['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(file => {
			[1, 2, 3, 4, 5, 6, 7, 8].forEach(rank => {
				if (!board[file][rank]) return;
				if (side === board[file][rank][0]) {
					valids = valids.concat(this.getValidMoves(file + rank, board).map(squ => `${this.getPiece(file + rank, board).join('')}${file}${rank}-${squ}`));
					return;
				}
			});
		});
		return valids;
	}
	checkAttacksAgainst (square, side, board) {
		if (!board) board = this.board;
		let checkedSquares = [], flag = false;
		if (Array.isArray(square)) square = square.join('');
		['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(file => {
			[1, 2, 3, 4, 5, 6, 7, 8].forEach(rank => {
				if (flag) return;
				if (!board[file][rank]) return;
				if (side === board[file][rank][0]) return;
				if (this.getSquares(file + rank, board).includes(square)) return flag = true;
			});
		});
		return flag;
	}
	simPlay (side, piece, origin, final, board) {
		if (!board) board = JSON.parse(JSON.stringify(this.board));
		else board = JSON.parse(JSON.stringify(board));
		board[origin[0]][origin[1]] = '';
		board[final[0]][final[1]] = side + piece;
		return board;
	}
	getValidMoves (square, board) {
		let recept = this.getPiece(square), piece = recept[1], side = recept[0];
		if (!board) board = this.board;
		square = [square[0], parseInt(square[1])];
		let simSquares = [];
		if (piece === 'P') {
			if (side === 'W' && square[1] === 5 && this.lastMoveP2 && this.adjFiles(square[0]).includes(this.lastMoveP2)) simSquares.push(this.lastMoveP2 + 6);
			else if (side === 'B' && square[1] === 4 && this.lastMoveP2 && this.adjFiles(square[0]).includes(this.lastMoveP2)) simSquares.push(this.lastMoveP2 + 3);
		}
		else if (piece === 'K') {
			if (side === 'W' && !this.W.Km && this.board.h[1] === 'WR' && !this.board.f[1] && !this.board.g[1] && !this.W.Rhm && !this.checkAttacksAgainst('e1', 'W') && !this.checkAttacksAgainst('f1', 'W') && !this.checkAttacksAgainst('g1', 'W') && !this.checkAttacksAgainst('h1', 'W')) simSquares.push('g1');
			if (side === 'W' && !this.W.Km && this.board.a[1] === 'WR' && !this.board.d[1] && !this.board.c[1] && !this.board.b[1] && !this.W.Ram && !this.checkAttacksAgainst('e1', 'W') && !this.checkAttacksAgainst('d1', 'W') && !this.checkAttacksAgainst('c1', 'W') && !this.checkAttacksAgainst('b1', 'W') && !this.checkAttacksAgainst('a1', 'W')) simSquares.push('c1');
			if (side === 'B' && !this.B.Km && this.board.h[8] === 'BR' && !this.board.f[8] && !this.board.g[8] && !this.B.Rhm && !this.checkAttacksAgainst('e8', 'B') && !this.checkAttacksAgainst('f8', 'B') && !this.checkAttacksAgainst('g8', 'B') && !this.checkAttacksAgainst('h8', 'B')) simSquares.push('g8');
			if (side === 'B' && !this.B.Km && this.board.a[8] === 'BR' && !this.board.d[8] && !this.board.c[8] && !this.board.b[8] && !this.B.Ram && !this.checkAttacksAgainst('e8', 'B') && !this.checkAttacksAgainst('d8', 'B') && !this.checkAttacksAgainst('c8', 'B') && !this.checkAttacksAgainst('b8', 'B') && !this.checkAttacksAgainst('a8', 'B')) simSquares.push('c8');
		}
		simSquares = simSquares.concat(this.getSquares(square, board));
		return simSquares.filter(squ => !this.checkChecks(side, this.simPlay(side, piece, square, squ, board)));
	}
	play (side, origin, final, callback) {
		if (!side || !(typeof(side) === 'string') || !origin || !(typeof(origin) === 'string') || !final || !(typeof(final) === 'string') || !callback || !(typeof(callback) === 'function')) return console.log('Invalid arguments.');
		if (!(this.turn === side)) return callback(0, 'Not your turn.');
		let moves = this.getValidMoves(origin), piece = this.getPiece(origin), captureFlag = '';
		if (piece[0] !== side) return;
		piece = piece[1];
		if (!moves.includes(final)) return callback(0, 'Invalid move.');
		if (this.board[final[0]][final[1]] && !this.board[final[0]][final[1]].startsWith(side)) {
			let capture = this.board[final[0]][final[1]];
			captureFlag = 'x';
			this[side].captures.push(capture[1]);
			if (capture[1] === 'R' && capture[0] !== side && (['a1', 'a8', 'h1', 'h8'].includes(final)) && !this[(side === 'W' ? 'B' : 'W')]['R' + final[0] + 'm']) this[(side === 'W' ? 'B' : 'W')]['R' + final[0] + 'm'] = true;
		}
		if (piece === 'P' && !(final[0] === origin[0]) && !this.board[final[0]][final[1]]) {
			this[side].captures.push('P');
			captureFlag = 'x';
			this.board[final[0]][origin[1]] = '';
		}
		if (piece === 'P' && Math.abs(final[1] - origin[1]) === 2) {
			this.board[final[0]][final[1]] = side + 'P';
			this.board[origin[0]][origin[1]] = '';
			this.lastMoveP2 = origin[0];
			this.moves.push(captureFlag ? `${origin[0]}x${final[0]}${final[1]}` : final);
			this.switchSides();
			if (!this.allValidMoves(this.turn, this.board).length) {
				if (this.checkChecks(this.turn, this.board)) {
					this.moves[this.moves.length - 1] += '#';
					return callback(3);
				}
				else {
					this.moves[this.moves.length - 1] += '$';
					return callback(4);
				}
			}
			if (this.checkChecks(this.turn, this.board)) this.moves[this.moves.length - 1] += '+';
			return callback(1);
		}
		this.lastMoveP2 = false;
		if (piece === 'K') {
			if (this.increment(this.increment(origin[0])) === final[0] || this.decrement(this.decrement(origin[0])) === final[0]) {
				if (final[0] === 'g') {
					this.board.g[origin[1]] = side + 'K';
					this.board.f[origin[1]] = side + 'R';
					this.board.e[origin[1]] = '';
					this.board.h[origin[1]] = '';
					this[side].Km = true;
					this[side].Rhm = true;
					this.moves.push('0-0');
					this.switchSides();
					if (!this.allValidMoves(this.turn, this.board).length) {
						if (this.checkChecks(this.turn, this.board)) {
							this.moves[this.moves.length - 1] += '#';
							return callback(3);
						}
						else {
							this.moves[this.moves.length - 1] += '$';
							return callback(4);
						}
					}
					if (this.checkChecks(this.turn, this.board)) this.moves[this.moves.length - 1] += '+';
					return callback(1);
				}
				if (final[0] === 'c') {
					this.board.c[origin[1]] = side + 'K';
					this.board.d[origin[1]] = side + 'R';
					this.board.e[origin[1]] = '';
					this.board.a[origin[1]] = '';
					this[side].Km = true;
					this[side].Ram = true;
					this.moves.push('0-0-0');
					this.switchSides();
					if (!this.allValidMoves(this.turn, this.board).length) {
						if (this.checkChecks(this.turn, this.board)) {
							this.moves[this.moves.length - 1] += '#';
							return callback(3);
						}
						else {
							this.moves[this.moves.length - 1] += '$';
							return callback(4);
						}
					}
					if (this.checkChecks(this.turn, this.board)) this.moves[this.moves.length - 1] += '+';
					return callback(1);
				}
			}
			this[side].Km = true;
		}
		if (piece === 'R' && (['a1', 'a8', 'h1', 'h8'].includes(origin)) && !this[(side === 'W' ? 'B' : 'W')]['R' + origin[0] + 'm']) this[(side === 'W' ? 'B' : 'W')]['R' + origin[0] + 'm'] = true;
		this.board[origin[0]][origin[1]] = '';
		this.board[final[0]][final[1]] = side + piece;
		if (piece === 'P' && [1, 8].includes(parseInt(final[1]))) {
			this[side].isPromoting = 1;
			if (captureFlag) this[side].isPromoting = origin[0];
			return callback(2, final);
		}
		switch (piece) {
			case 'P': {
				this.moves.push(captureFlag ? `${origin[0]}x${final[0]}${final[1]}` : final);
				break;
			}
			case 'K': {
				this.moves.push(`K${captureFlag}${final}`);
				break;
			}
			default: {
				let pos = this.getLocationsOfPiecesAgainst(this.turn + piece, final);
				if (!pos) return;
				if (!pos.filter(loc => loc[0] == origin[0]).length) this.moves.push(piece + captureFlag + final);
				else if (!pos.filter(loc => loc[1] == origin[1]).length) this.moves.push(piece + origin[0] + captureFlag + final);
				else this.moves.push(piece + origin + captureFlag + final);
				break;
			}
		}
		this.switchSides();
		if (!this.allValidMoves(this.turn, this.board).length) {
			if (this.checkChecks(this.turn, this.board)) {
				this.moves[this.moves.length - 1] += '#';
				return callback(3);
			}
			else {
				this.moves[this.moves.length - 1] += '$';
				return callback(4);
			}
		}
		if (this.checkChecks(this.turn, this.board)) this.moves[this.moves.length - 1] += '+';
		return callback(1);
	}
	promote (piece, square, side, callback) {
		if (!(this.turn === side) || !this[side].isPromoting || !(this.board[square[0]][square[1]]) === side + 'P') return null;
		let captureFlag = this[side].isPromoting == 1 ? '' : this[side].isPromoting + 'x';
		this[side].isPromoting = false;
		this.board[square[0]][square[1]] = side + piece;
		this.moves.push(captureFlag + square + '=' + piece);
		this.switchSides();
		if (!this.allValidMoves(this.turn, this.board).length) {
			if (this.checkChecks(this.turn, this.board)) {
				this.moves[this.moves.length - 1] += '#';
				return callback(3);
			}
			else {
				this.moves[this.moves.length - 1] += '$';
				return callback(4);
			}
		}
		if (this.checkChecks(this.turn, this.board)) this.moves[this.moves.length - 1] += '+';
		return callback(1);
	}
	getColourOf (square, flag) {
		if (flag) {
			if (flag === 'last' && this.colours.last) return this.colours.last;
			if (flag === 'sel' && this.colours.sel) return this.colours.sel;
			if (flag === 'hl' && this.colours.hl) return this.colours.hl;
		}
		if (typeof(square) === 'number') return (square % 2) ? this.colours.B : this.colours.W;
		let a = parseInt(square[1]), b = 0;
		if (['b', 'd', 'f', 'h'].includes(square[0])) b = 1;
		return ((a + b) % 2) ? this.colours.B : this.colours.W;
	}
	boardHTML (side, selected, highlighted, lastPlayed) {
		let html = '', imgsrc, room = this.id;
		if (room.startsWith('groupchat-')) imgsrc = this.emosrc;
		else imgsrc = this.imgsrc;
		if (selected && this.getPiece(selected)[0] !== side) return;
		switch (side) {
			case 'W': {
				html += `<TABLE style="border-collapse:collapse;" border="1"><TR style="height: 15;"><TH width="15" height="15"></TH><TH width="35">A</TH><TH width="35">B</TH><TH width="35">C</TH><TH width="35">D</TH><TH width="35">E</TH><TH width="35">F</TH><TH width="35">G</TH><TH width="35">H</TH><TH width="15"></TH></TR>`;
				let j = 0;
				for (let i = 8; i > 0; i--) {
					html += `<TR style="height: 35;"><TD height="35"><B><CENTER>${i}</CENTER></B></TD>`;
					html += Object.keys(this.board).map(file => {
						if (selected && (file + i === selected)) return [2, this.board[file][i], file];
						if (highlighted && highlighted.includes(file + i)) return [1, this.board[file][i], file];
						return [0, this.board[file][i], file];
					}).map(piece => {
						if (!piece[0]) return `<TD bgcolor="${this.getColourOf(j++)}" height="35" width="35"><BUTTON name="send" value="/w ${Bot.status.nickName}, ${prefix}chess ${this.id} select ${piece[2]}${i}" style="background: none; border: none;">${(piece[1] ? (imgsrc[piece[1]] || piece[1]) : '')}</BUTTON></TD>`;
						if (piece[0] === 1) return `<TD bgcolor="${this.getColourOf(j++, 'hl')}" height="35" width="35"><BUTTON name="send" value="/w ${Bot.status.nickName}, ${prefix}chess ${this.id} play ${selected}-${piece[2]}${i}" style="background: none; border: none; width: 100%; height: 100%;">${(piece[1] ? (imgsrc[piece[1]] || piece[1]) : '')}</BUTTON></TD>`;
						else return `<TD bgcolor="${this.getColourOf(j++, 'sel')}" height="35" width="35"><BUTTON name="send" value="/w ${Bot.status.nickName}, ${prefix}chess ${this.id} deselect" style="background: none; border: none;">${(piece[1] ? (imgsrc[piece[1]] || piece[1]) : '')}</BUTTON></TD>`;
					}).join('');
					html += `<TH>${i}</TH></TR>`;
					j++;
				}
				html += '<TR height="15"><TH height="15"></TH><TH height="15">A</TH><TH height="15">B</TH><TH height="15">C</TH><TH height="15">D</TH><TH height="15">E</TH><TH height="15">F</TH><TH height="15">G</TH><TH height="15">H</TH><TH height="15"></TH></TR></TABLE>';
				break;
			}
			case 'B': {
				html += `<TABLE style="border-collapse:collapse;" border="1"><TR style="height: 15;"><TH width="15" height="15"></TH><TH width="35" height="15">H</TH><TH width="35" height="15">G</TH><TH width="35" height="15">F</TH><TH width="35" height="15">E</TH><TH width="35" height="15">D</TH><TH width="35" height="15">C</TH><TH width="35" height="15">B</TH><TH width="35" height="15">A</TH><TH width="15" height="15"></TH></TR>`;
				let j = 0;
				for (let i = 1; i < 9; i++) {
					html += `<TR style="height: 35;"><TD height="35"><B><CENTER>${i}</CENTER></B></TD>`;
					html += Object.keys(this.board).reverse().map(file => {
						if (selected && (file + i === selected)) return [2, this.board[file][i], file];
						if (highlighted && highlighted.includes(file + i)) return [1, this.board[file][i], file];
						return [0, this.board[file][i], file];
					}).map(piece => {
						if (!piece[0]) return `<TD bgcolor="${this.getColourOf(j++)}" height="35"><BUTTON name="send" value="/w ${Bot.status.nickName}, ${prefix}chess ${this.id} select ${piece[2]}${i}" style="background: none; border: none;">${(piece[1] ? (imgsrc[piece[1]] || piece[1]) : '')}</BUTTON></TD>`;
						if (piece[0] === 1) return `<TD bgcolor="${this.getColourOf(j++, 'hl')}" height="35"><BUTTON name="send" value="/w ${Bot.status.nickName}, ${prefix}chess ${this.id} play ${selected}-${piece[2]}${i}" style="background: none; border: none; width: 100%; height: 100%;">${(piece[1] ? (imgsrc[piece[1]] || piece[1]) : '')}</BUTTON></TD>`;
						else return `<TD bgcolor="${this.getColourOf(j++, 'sel')}" height="35"><BUTTON name="send" value="/w ${Bot.status.nickName}, ${prefix}chess ${this.id} deselect" style="background: none; border: none;">${(piece[1] ? (imgsrc[piece[1]] || piece[1]) : '')}</BUTTON></TD>`;
					}).join('');
					html += `<TH width="15">${i}</TH></TR>`;
					j++;
				}
				html += '<TR style="height: 35;"><TH width="15"></TH><TH width="35">H</TH><TH width="35">G</TH><TH width="35">F</TH><TH width="35">E</TH><TH width="35">D</TH><TH width="35">C</TH><TH width="35">B</TH><TH width="35">A</TH><TH width="15"></TH></TR></TABLE>';
				break;
			}
			default: {
				break;
			}
		}
		return html;
	}
}

exports.Chess = Chess;
