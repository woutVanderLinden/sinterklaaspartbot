module.exports = {
	cooldown: 10,
	help: `December ke event ke team members ko dikhaata hai.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		let html = `<hr/><b><u>Winter Fest Event ki Teams</u>:</b><br><psicon pokemon="snover"><b>TEAM Snover-</b> <strong style="color:hsl(350,54%,51.33640103858261%);">Swagsire87</strong> | <strong style="color:hsl(331,56%,50.38242799500146%);">Okanama</strong> | <strong style="color:hsl(171,47%,42%);">MagicalXerneas</strong><br><psicon pokemon="stantler"><b>TEAM Stantler -</b> <strong style="color:hsl(2,79%,41.573204174381885%);">Shivam3299</strong> | <strong style="color:hsl(7,52%,47.477852796382386%);">Abhk</strong> | <strong style="color:hsl(6,89%,44.151673933974735%);">Metalkarp99</strong><br><psicon pokemon="cryogonal"><b>TEAM Cryogonal -</b>  <strong style="color:hsl(121,57%,41.9040582471333%);">MechYTR 009</strong> | <strong style="color:hsl(103,63%,39%);">Technobearz</strong> | <strong style="color:hsl(11,84%,39%);">Tomoba</strong><br><psicon pokemon="delibird"><b>TEAM Delibird -</b> <strong style="color:hsl(128,75%,31%);">Sarthak G</strong> | <strong style="color:hsl(123,75%,33%);">A-Drago Destroyer</strong> | <strong style="color:hsl(283,40%,51.76628906108017%);">Thegamingattack3</strong><br><psicon pokemon="pineco"><b>TEAM Pineco -</b> <strong style="color:hsl(191,89%,31.333333333333332%);">PGJMX</strong> | <strong style="color:hsl(307,77%,46%);">Sir_Meliodas_DEVIL</strong> | <strong style="color:hsl(110,76%,37.39422929455615%);">Manik2375</strong><hr/>`;
		if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, `/adduhtml TEAMS,${html}`);
		else Bot.sendHTML(by, html);
	}
}