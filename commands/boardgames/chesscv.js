module.exports = {
	cooldown: 10000,
	help: `Converts a given chessboard into FEN.`,
	permissions: 'alpha',
	commandFunction: function (Bot, room, time, by, args, client) {
		let imgLink = args.join(' ').match(/https?:\/\/\S*/);
		if (!imgLink) return Bot.say(room, `No image link found.`);
		imgLink = imgLink[0];
		axios.get(imgLink).then(res => {
			if (!res.headers['content-type'].startsWith('image/')) {
				return Bot.say(room, `Could not detect a valid image in ${imgLink}`);
			}
			let { exec } = require('child_process');
			exec(`/usr/bin/python3 /home/ubuntu/PartBot/data/CHESSCV/tensorflow_chessbot.py --url ${imgLink}`, { cwd: '/home/ubuntu/PartBot/data/CHESSCV', shell: false }, (error, stdout, stderr) => {
				let info = stdout;
				let fen = info.match(/\nPredicted FEN:\n([^\n]*)\n/), certain = info.match(/Final Certainty: [\d\.]+%/);
				if (!certain || (certain = parseInt(certain[1])) < 90) return Bot.say(room, `Unable to analyze image.`);
				if (!fen) return Bot.say(room, `Invalid FEN`);
				Bot.say(room, `Generated FEN: ${fen[1]}`);
			});
		}).catch((err) => {
			Bot.say(room, `Could not detect a valid image in ${imgLink}`);
		});
	}
}

/*

---
Visualize tiles link:
 http://tetration.xyz/tensorflow_chessbot/overlay_chessboard.html?1,0,481,480,https%3A%2F%2Fcdn.discordapp.com%2Fattachments%2F738350604510036050%2F825827681018576896%2Funknown.png
---

--- Prediction on url https://cdn.discordapp.com/attachments/738350604510036050/825827681018576896/unknown.png ---
     Loading model 'saved_models/frozen_graph.pb'
     Model restored.
Closing session.
Per-tile certainty:
[[1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]
 [1. 1. 1. 1. 1. 1. 1. 1.]]
Certainty range [0.999995 - 1], Avg: 0.999998
---
Predicted FEN:
8/3R1N1k/3Bp1p1/7p/4bpP1/5Q2/1K6/6q1 w - - 0 1
Final Certainty: 100.0%

*/
