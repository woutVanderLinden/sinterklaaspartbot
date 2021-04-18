module.exports = function (Bot) {
	/*
	* This will run every 20 seconds. Keep this code as efficient as possible.
	*/
	if (Bot.rooms['2v2']) {
		Bot.say('', '/cmd roomlist gen82v2doubles');
	}
}