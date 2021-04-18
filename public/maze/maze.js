Array.prototype.shuffle = function () {
	for (let i = this.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
	return Array.from(this);
}

let MAZE = {};

MAZE.neighbors = function (x, y, maze) {
	let out = [];
	if (maze[x + 2] && maze[x + 2][y] == 0) out.push('D');
	if (maze[x - 2] && maze[x - 2][y] == 0) out.push('U');
	if (maze[x][y + 2] == 0) out.push('R');
	if (maze[x][y - 2] == 0) out.push('L');
	return out;
}

MAZE.create = function (x, y) {
	let maze = Array.from({length: 2 * x + 1}).map(row => Array.from({length: 2 * y + 1}).fill(0)), stack = [];
	stack.push([1, 1]);
	maze[1][1] = 1;
	while (stack.length) {
		let last = stack[stack.length - 1], n = MAZE.neighbors(...last, maze), flag = false;
		n.shuffle();
		for (let c of n) {
			if (flag) break;
			switch (c) {
				case 'D': {
					if (maze[last[0] + 2][last[1]]) break;
					flag = true;
					maze[last[0] + 1][last[1]] = 1;
					maze[last[0] + 2][last[1]] = 1;
					stack.push([last[0] + 2, last[1]]);
					break;
				}
				case 'U': {
					if (maze[last[0] - 2][last[1]]) break;
					flag = true;
					maze[last[0] - 1][last[1]] = 1;
					maze[last[0] - 2][last[1]] = 1;
					stack.push([last[0] - 2, last[1]]);
					break;
				}
				case 'R': {
					if (maze[last[0]][last[1] + 2]) break;
					flag = true;
					maze[last[0]][last[1] + 1] = 1;
					maze[last[0]][last[1] + 2] = 1;
					stack.push([last[0], last[1] + 2]);
					break;
				}
				case 'L': {
					if (maze[last[0]][last[1] - 2]) break;
					flag = true;
					maze[last[0]][last[1] - 1] = 1;
					maze[last[0]][last[1] - 2] = 1;
					stack.push([last[0], last[1] - 2]);
					break;
				}
				default: break;
			}
		}
		if (flag) continue;
		stack.pop();
	}
	maze[0][1] = 1;
	maze[2 * x][2 * y - 1] = 1;
	return maze;
}