module.exports = {
    cooldown: 1000,
    help: `Picks between a list of choices, separated by commas.`,
    permissions: 'gamma',
    commandFunction: function (Bot, room, time, by, args, client) {
    	let a = args.join(' ').split(/, ?/g);
        Bot.say(room, `${a[0]?'[[]][[]]'+a[Math.floor(Math.random()*a.length)]:'/me chooses nothing'}`);
    }
}