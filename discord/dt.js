module.exports = {
	help: `Displays the infoarmation for a Pokemon / move / item / ability`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		let dt = toID(args.join(''));
		if (dt === 'constructor') return message.channel.send('-_-');
		let search;
		if (dt === 'toxtricitylowkeygmax') search = 'toxtricitygmax';
		else search = dt;
		let tier = mon.tier;
		let formes = ["Pikachu-Belle", "Pikachu-Libre", "Pikachu-PhD", "Pikachu-Pop-Star", "Pikachu-Rock-Star", "Pikachu-Cosplay", "Unown-Ex", "Unown-Qm", "Unown-B", "Unown-C", "Unown-D", "Unown-E", "Unown-F", "Unown-G", "Unown-H", "Unown-I", "Unown-J", "Unown-K", "Unown-L", "Unown-M", "Unown-N", "Unown-O", "Unown-P", "Unown-Q", "Unown-R", "Unown-S", "Unown-T", "Unown-U", "Unown-V", "Unown-W", "Unown-X", "Unown-Y", "Unown-Z", "Castform-Rainy", "Castform-Snowy", "Castform-Sunny", "Deoxys-Attack", "Deoxys-Defense", "Deoxys-Speed", "Burmy-Sandy", "Burmy-Trash", "Wormadam-Sandy", "Wormadam-Trash", "Cherrim-Sunny", "Shellos-East", "Gastrodon-East", "Rotom-Fan", "Rotom-Frost", "Rotom-Heat", "Rotom-Mow", "Rotom-Wash", "Giratina-Origin", "Shaymin-Sky", "Unfezant-F", "Basculin-Blue-Striped", "Darmanitan-Zen", "Deerling-Autumn", "Deerling-Summer", "Deerling-Winter", "Sawsbuck-Autumn", "Sawsbuck-Summer", "Sawsbuck-Winter", "Frillish-F", "Jellicent-F", "Tornadus-Therian", "Thundurus-Therian", "Landorus-Therian", "Kyurem-Black", "Kyurem-White", "Keldeo-Resolute", "Meloetta-Pirouette", "Vivillon-Archipelago", "Vivillon-Continental", "Vivillon-Elegant", "Vivillon-Fancy", "Vivillon-Garden", "Vivillon-High-Plains", "Vivillon-Icy-Snow", "Vivillon-Jungle", "Vivillon-Marine", "Vivillon-Modern", "Vivillon-Monsoon", "Vivillon-Ocean", "Vivillon-Pokeball", "Vivillon-Polar", "Vivillon-River", "Vivillon-Sandstorm", "Vivillon-Savanna", "Vivillon-Sun", "Vivillon-Tundra", "Pyroar-F", "Flabebe-Blue", "Flabebe-Orange", "Flabebe-White", "Flabebe-Yellow", "Floette-Blue", "Floette-Eternal", "Floette-Orange", "Floette-White", "Floette-Yellow", "Florges-Blue", "Florges-Orange", "Florges-White", "Florges-Yellow", "Furfrou-Dandy", "Furfrou-Debutante", "Furfrou-Diamond", "Furfrou-Heart", "Furfrou-Kabuki", "Furfrou-La-Reine", "Furfrou-Matron", "Furfrou-Pharaoh", "Furfrou-Star", "Meowstic-F", "Aegislash-Blade", "Xerneas-Neutral", "Hoopa-Unbound", "Rattata-Alola", "Raticate-Alola", "Raichu-Alola", "Sandshrew-Alola", "Sandslash-Alola", "Vulpix-Alola", "Ninetales-Alola", "Diglett-Alola", "Dugtrio-Alola", "Meowth-Alola", "Persian-Alola", "Geodude-Alola", "Graveler-Alola", "Golem-Alola", "Grimer-Alola", "Muk-Alola", "Exeggutor-Alola", "Marowak-Alola", "Greninja-Ash", "Zygarde-10%", "Zygarde-Complete", "Oricorio-Pom-Pom", "Oricorio-Pa'u", "Oricorio-Sensu", "Lycanroc-Midnight", "Wishiwashi-School", "Minior-Meteor", "Minior-Orange", "Minior-Yellow", "Minior-Green", "Minior-Blue", "Minior-Indigo", "Minior-Violet", "Magearna-Original", "Pikachu-Kanto", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner", "Lycanroc-Dusk", "Necrozma-Dusk-Mane", "Necrozma-Dawn-Wings", "Necrozma-Ultra", "Pikachu-Starter", "Eevee-Starter", "Meowth-Galar", "Ponyta-Galar", "Rapidash-Galar", "Farfetch'd-Galar", "Weezing-Galar", "Mr. Mime-Galar", "Corsola-Galar", "Zigzagoon-Galar", "Linoone-Galar", "Darumaka-Galar", "Darmanitan-Galar", "Darmanitan-Galar-Zen", "Yamask-Galar", "Stunfisk-Galar", "Cramorant-Gulping", "Cramorant-Gorging", "Toxtricity-Low-Key", "Alcremie-Ruby-Cream", "Alcremie-Matcha-Cream", "Alcremie-Mint-Cream", "Alcremie-Lemon-Cream", "Alcremie-Salted-Cream", "Alcremie-Ruby-Swirl", "Alcremie-Caramel-Swirl", "Alcremie-Rainbow-Swirl", "Eiscue-Noice", "Indeedee-F", "Morpeko-Hangry", "Zacian-Crowned", "Zamazenta-Crowned", "Slowpoke-Galar", "Slowbro-Galar", "Zarude-Dada", "Pikachu-World", "Articuno-Galar", "Zapdos-Galar", "Moltres-Galar", "Slowking-Galar", "Calyrex-Ice", "Calyrex-Shadow"].map(toID); // 902
		let megamaxes = ["Venusaur-Mega", "Charizard-Mega-X", "Charizard-Mega-Y", "Blastoise-Mega", "Beedrill-Mega", "Pidgeot-Mega", "Alakazam-Mega", "Slowbro-Mega", "Gengar-Mega", "Kangaskhan-Mega", "Pinsir-Mega", "Gyarados-Mega", "Aerodactyl-Mega", "Mewtwo-Mega-X", "Mewtwo-Mega-Y", "Ampharos-Mega", "Steelix-Mega", "Scizor-Mega", "Heracross-Mega", "Houndoom-Mega", "Tyranitar-Mega", "Sceptile-Mega", "Blaziken-Mega", "Swampert-Mega", "Gardevoir-Mega", "Sableye-Mega", "Mawile-Mega", "Aggron-Mega", "Medicham-Mega", "Manectric-Mega", "Sharpedo-Mega", "Camerupt-Mega", "Altaria-Mega", "Banette-Mega", "Absol-Mega", "Glalie-Mega", "Salamence-Mega", "Metagross-Mega", "Latias-Mega", "Latios-Mega", "Kyogre-Primal", "Groudon-Primal", "Rayquaza-Mega", "Lopunny-Mega", "Garchomp-Mega", "Lucario-Mega", "Abomasnow-Mega", "Gallade-Mega", "Audino-Mega", "Diancie-Mega", "Charizard-Gmax", "Butterfree-Gmax", "Pikachu-Gmax", "Meowth-Gmax", "Machamp-Gmax", "Gengar-Gmax", "Kingler-Gmax", "Lapras-Gmax", "Eevee-Gmax", "Snorlax-Gmax", "Garbodor-Gmax", "Melmetal-Gmax", "Corviknight-Gmax", "Orbeetle-Gmax", "Drednaw-Gmax", "Coalossal-Gmax", "Flapple-Gmax", "Appletun-Gmax", "Sandaconda-Gmax", "Toxtricity-Gmax", "Centiskorch-Gmax", "Hatterene-Gmax", "Grimmsnarl-Gmax", "Alcremie-Gmax", "Copperajah-Gmax", "Duraludon-Gmax", "Eternatus-Eternamax", "Venusaur-Gmax", "Blastoise-Gmax", "Rillaboom-Gmax", "Cinderace-Gmax", "Inteleon-Gmax", "Urshifu-Gmax", "Urshifu-Rapid-Strike-Gmax"].map(toID); // 1116
		let mon = data.pokedex[toID(require('../data/ALIASES/pokemon.json')[dt]) || dt];
		if (!mon) return message.channel.send("Pokemon not found.");
		let index;
		if ((index = formes.indexOf(search)) > -1) index += 902;
		else if ((index = formes.indexOf(toID(mon.name))) > -1) index += 902;
		else if ((index = megamaxes.indexOf(search)) > -1) index += 1116;
		else if ((index = megamaxes.indexOf(toID(mon))) > -1) index += 1116;
		else index = mon.num;
		let addr = ('000' + index).substr(-4).replace(/^0/, '');
		let Discord = require('discord.js');
		let embed = new Discord.MessageEmbed();
		embed.setAuthor(`#${('00' + mon.num).substr(-3)}`, `${websiteLink}/public/sprites/tile${addr}.png`);
		embed.setTitle(`${mon.name} [${tier}]`);
		embed.addField('Stats', `\`\`\`\n  HP | Atk | Def | SpA | SpD | Spe | BST \n` + [...Object.values(mon.baseStats), Object.values(mon.baseStats).reduce((a, b) => a + b, 0)].map(n => (`  ` + n).substr(-3)).map(n => ` ${n} `).join('|') + "\n```");
		let base = toID(mon.baseSpecies || mon.name);
		let forme = toID(mon.forme || '') || (dt.startsWith(base) ? dt.substr(base.length) : '');
		if (forme === 'lowkeygmax') forme = 'gmax';
		let imgLink = `https://play.pokemonshowdown.com/sprites/ani/${base + (forme ? `-${forme}` : '')}.gif`;
		embed.addFields(
			{ name: '\u200b', value: `**Type**: ${mon.types.join(' / ')}` },
			{ name: '\u200b', value: '**Abilities**', inline: true },
			{ name: '\u200b', value: `${mon.abilities[0]}\n${mon.abilities[1] || '\u200b'}`, inline: true },
			{ name: '\u200b', value: `${mon.abilities.H ? `_${mon.abilities.H}_` : '\u200b'}${mon.abilities.S ? `\n_(${mon.abilities.S})_` : ''}`, inline: true },
			{ name: '\u200b', value: `Height: ${mon.heightm} m | Weight: ${mon.weightkg} kg (TBD BP) | Dex Colour: ${mon.color}\nEgg Group${mon.eggGroups.length === 1 ? '' : 's'}: ${mon.eggGroups.join(', ')}\n${mon.evos ? `Evolves into ${mon.evos.join('/')}` : 'Does not evolve'}` }
		);
		embed.setThumbnail(imgLink);
		message.channel.send(embed);
	}
}