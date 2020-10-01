module.exports = {
	cooldown: 1000,
	help: `PartBot's quotes module. Syntax: ${prefix}q (random | list | amount | last | preview | add | delete (quote number))`,
	permissions: "none",
	commandFunction: function(Bot, room, time, by, args, client, pm) {
		let qfol = "./data/QUOTES/" + room;
		let exec = toId(args[0]) || "random";
		if (!Bot.rooms[room].rank) return Bot.pm(by, "Lemme get stuff set up, first.");
		switch (exec) {
			case "add": {
				if (pm || !tools.hasPermission(by, "beta", room)) return Bot.pm(by, "Access denied.");
				args.shift();
				if (!args[0]) return Bot.pm(by, unxa);
				let inite = args.join(" ").split("\\n");
				let addstr = "";
				inite.forEach(line => addstr += /^ /.test(line) ? "\n" + line.substr(1) : "\n" + line);
				if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt")) fs.writeFileSync("./data/QUOTES/" + room + ".txt", "");
				let qArr = JSON.parse(fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8"));
				qArr.push(addstr);
				fs.writeFile("./data/QUOTES/" + room + ".txt", JSON.stringify(qArr, null, 2), e => {
					if (e) return Bot.log(e);
					Bot.say(room, "Quote has been added.");
					return Bot.log(by.substr(1) + " added a quote in " + room + ": \n" + addstr);
				});
				break;
			}
			case "preview": {
				args.shift();
				if (!args[0]) return Bot.pm(by, unxa);
				let inite = args.join(" ").split("\\n");
				let addstr = "";
				inite.forEach(line => {addstr += tools.quoteParse(/^ /.test(line) ? line.substr(1) : line)});
				if (!pm && tools.hasPermission(by, "gamma", room)) return Bot.say(room, "/adduhtml QUOTE, <HR>" + addstr + "<HR>");
				else return Bot.sendHTML(by, addstr);
			}
			case "list": {
				if (pm || !tools.hasPermission(by, "gamma", room)) return Bot.pm(by, "Access denied.");
				if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt")) return Bot.pm(by, "No quotes for this room.");
				let qArr = JSON.parse(fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8")), outstr = '';
				if (!qArr.length) return Bot.pm(by, "No quotes for this room.");
				qArr.forEach((quote, index) => outstr += "<DETAILS><SUMMARY>Q" + (index + 1) + ": </SUMMARY><HR>" + tools.quoteParse(quote) + "<HR></DETAILS><BR>");
				return Bot.say(room, "/adduhtml QUOTE, <DETAILS><SUMMARY>Quotes</SUMMARY><HR>" + outstr + "<HR></DETAILS>");
			}
			case "delete": {
				if (pm || !tools.hasPermission(by, "beta", room)) return Bot.pm(by, "Access denied.");
				if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt")) return Bot.pm(by, "No quotes in this room.");
				if (!args[1]) return Bot.pm(by, unxa);
				let qArr = JSON.parse(fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8"));
				if (!qArr.length) return Bot.pm(by, "No quotes for this room.");
				args.splice(0, 1);
				let gno = parseInt(args.join(" ").replace(/[^0-9]/g, ""));
				if (isNaN(gno) || gno > qArr.length || gno < 1) return Bot.pm(by, "Invalid quote number.");
				let delstr = qArr[gno - 1];
				qArr.splice(gno - 1, 1);
				fs.writeFile("./data/QUOTES/" + room + ".txt", JSON.stringify(qArr, null, 2), e => {
					if (e) return Bot.log(e);
					Bot.say(room, "Quote has been deleted.");
					return Bot.log(by.substr(1) + " deleted a quote in " + room + ": \n" + delstr);
				});
				break;
			}
			case "amount": case 'amt': {
				if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt")) return Bot.pm(by, "No quotes in this room.");
				let qArr = JSON.parse(fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8"));
        if (pm || !tools.hasPermission(by, 'gamma')) return Bot.pm(by, "This room has " + (qArr.length || 'no') + ` quote${qArr.length == 1 ? '' : 's'}.`);
				else return Bot.say(room, "This room has " + (qArr.length || 'no') + ` quote${qArr.length == 1 ? '' : 's'}.`);
			}
			case "find": case "search": {
				if (pm || !tools.hasPermission(by, "gamma", room)) return Bot.pm(by, "Access denied.");
				if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt")) return Bot.pm(by, "No quotes in this room.");
				let qArr = JSON.parse(fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8"));
				if (!qArr.length || !Array.isArray(qArr)) return Bot.pm(by, "No quotes for this room.");
				if (!(args.length - 1)) return Bot.pm(by, unxa);
				args.splice(0, 1);
				let key = args.join(" ").toLowerCase(), fArr = qArr.filter(quote => quote.toLowerCase().includes(key)), outstr = '';
				fArr.forEach(quote => outstr += "<DETAILS><SUMMARY>Q" + (qArr.indexOf(quote) + 1) + ": </SUMMARY><HR>" + tools.quoteParse(quote) + "<HR></DETAILS><BR>");
				if (!outstr) return Bot.pm(by, "No quotes found.");
				return Bot.say(room, "/adduhtml QUOTE, <DETAILS><SUMMARY>Quotes</SUMMARY><HR>" + outstr + "<HR></DETAILS>");
			}
			case 'last': {
				if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt")) return Bot.pm(by, "No quotes in this room.");
				let qArr = JSON.parse(fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8"));
				if (!qArr.length) return Bot.pm(by, "No quotes for this room.");
				let quote = tools.quoteParse(qArr[qArr.length - 1]);
				if (!pm && tools.hasPermission(by, 'gamma', room)) return Bot.say(room, `/adduhtml QUOTE, <HR> ` + quote + '<HR>');
				else return Bot.sendHTML(by, quote);
			}
			default: {
				let ano;
				if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt")) return Bot.pm(by, "No quotes in this room.");
				let qArr = JSON.parse(fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8"));
				if (!qArr.length) return Bot.pm(by, "No quotes for this room.");
				if (exec == "random" || exec == "r") ano = Math.floor(Math.random() * qArr.length + 1);
				if (!ano) ano = parseInt(args.join(" ").replace(/[^0-9]/g, ""));
				if (isNaN(ano) || ano < 1 || ano > qArr.length) return Bot.pm(by, "Invalid quote number.");
				let qtext = tools.quoteParse(qArr[ano - 1]);
				if (!pm && tools.hasPermission(by, "gamma", room)) return Bot.say(room, "/adduhtml QUOTE, <HR>" + qtext + "<HR>");
				else return Bot.sendHTML(by, qtext);
			}
		}
	}
}
