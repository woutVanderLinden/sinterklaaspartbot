module.exports = {
    cooldown: 1000,
    help: `Filters through the Pokedex. \`\`dex\`\` is the Pokedex object, \`\`m\`\` is the Pokemon ID.`,
    permissions: 'coder',
    commandFunction: function (Bot, by, args, client) {
        try {
			let filter = new Function(`return function (m, dex) {${args.join(' ')}}`)();
			let out = Object.keys(data.pokedex).filter(m => filter(m, data.pokedex));
			if (!out.length) return Bot.pm(by, 'None.');
			return Bot.sendHTML(by, '<DETAILS><SUMMARY>Results</SUMMARY>' + out.map(m => data.pokedex[m].name).sort().join('<BR>') + '</DETAILS>');
		} catch (e) {
			Bot.pm(by, e.message);
			Bot.log(JSON.stringify(e));
		}
    }
}