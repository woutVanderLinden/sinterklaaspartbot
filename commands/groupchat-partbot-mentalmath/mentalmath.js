module.exports = {
	cooldown: 5000,
	help: `Displays the help for the Mental Math module.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `PartBot has a Mental Math module that randomly generates questions! To create a question, use \`\`${prefix}nextquestion (difficulty level)\`\`. To answer, use \`\`${prefix}answer (your answer)\`\`. To view the scores, use \`\`${prefix}scores\`\`.`);
	}
}