module.exports = {
	cooldown: 1000,
	help: `Filters through the Pokedex. \`\`dex\`\` is the Pokedex object, \`\`m\`\` is the Pokemon ID.`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		try {
			let func = args.join(' ');
			if (!func.includes('return')) func = 'return ' + func;
			const filter = new Function(`return function (m, dex) {${func}}`)();
			const out = Object.keys(data.pokedex).filter(m => filter(m, data.pokedex));
			if (!out.length) return Bot.pm(by, 'None.');
			// eslint-disable-next-line max-len
			return Bot.sendHTML(by, `<DETAILS><SUMMARY>Results (${out.length})</SUMMARY>` + out.map(m => data.pokedex[m].name).sort().join('<BR>') + '</DETAILS>');
		} catch (e) {
			Bot.pm(by, e.message);
		}
	}
};
