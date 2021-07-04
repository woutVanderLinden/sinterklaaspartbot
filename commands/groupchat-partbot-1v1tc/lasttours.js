module.exports = {
	cooldown: 10000,
	help: `Displays a record of the last 10 Tours created.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `/addhtmlbox <DETAILS><SUMMARY>Recent Tours</SUMMARY>${JSON.parse(fs.readFileSync('./data/DATA/tourrecords.json','utf8')).sort((a,b)=>b.time-a.time).splice(0,10).map(t=>tools.colourize(tools.toName(t.starter))+(t.official?'<B>':'')+' > '+(t.official?'</B>':'')+tools.colourize(tools.toName(t.type))+' ('+tools.toHumanTime(Date.now()-t.time)+' ago)').join('<BR>')}</DETAILS>`);   
	}
}