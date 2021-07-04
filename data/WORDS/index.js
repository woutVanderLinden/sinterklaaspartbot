const dicts = {
	'csw19': require('./csw19.json'),
	'csw21': require('./csw21.json')
}

module.exports = {
	dicts: dicts,
	mods: {
		clabbers: word => require('./clabbers.json')[word.split('').sort().join('')],
		pokemon: word => data.moves.hasOwnProperty(word) || (data.pokedex.hasOwnProperty(word) && !data.pokedex[word].forme) || data.abilities.find(a => toID(a) === word) || data.items.hasOwnProperty(word)
	},
	checkWord: function (word, dict = 'csw21', mod) {
		dict = toID(dict);
		word = toID(word);
		mod = toID(mod);
		if (!dicts.hasOwnProperty(dict)) return null;
		if (mod && this.mods[mod]) if (this.mods[mod](word)) return true;
		if (dicts[dict][word]) return true;
		return false;
	},
	isDict: dict => dicts.hasOwnProperty(toID(dict))
}