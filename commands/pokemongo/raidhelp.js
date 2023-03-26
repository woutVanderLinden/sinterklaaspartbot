/* eslint-disable max-len */

module.exports = {
	cooldown: 0,
	help: `A brief introduction to how raids work on PS!`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		// eslint-disable-next-line max-len
		const HTML = `<div style="padding:20px;">\n\n<h1 id="pok-mon-go-raid-help">Pokémon GO Raid Help</h1>\n\n<details><summary><span style="font-size:1.17em;margin-top:1em;margin-bottom:1em;margin-left:0;margin-right:0;font-weight:bold;display:inline-flex;" id="registering">Registering</span></summary>\n\n<p>In order to join and host raids on PS, you&#39;ll need to register first! Simply type <code>,register</code> in chat and fill in the form with your info. You can always change your info later by filling in the form again.</p>\n<hr/>\n\n</details><details><summary><span style="font-size:1.17em;margin-top:1em;margin-bottom:1em;margin-left:0;margin-right:0;font-weight:bold;display:inline-flex;" id="raid-list">Raid List</span></summary>\n\n<p>Once you&#39;ve registered, you can set up your own raid list. Whenever someone hosts a raid for a Pokémon on your list, you&#39;ll receive a notification. There&#39;s four commands you can use for this:</p>\n<ul>\n<li><code>,addraids (Pokémon 1), (Pokémon 2), ...</code> - Adds the specified Pokémon to your raid list (up to 10).</li>\n<li><code>,removeraids (Pokémon 1), (Pokémon 2), ...</code> - Removes the specified Pokémon from your raid list.</li>\n<li><code>,myraids</code> - Shows you your current raid list.</li>\n<li><code>,setraids (Pokémon 1), (Pokémon 2), ...</code> - Overwrites your current list to the list you specify.</li>\n</ul>\n<p>You can also prefix <strong>WB</strong> to a Pokémon name (eg:- WB Mewtwo) to only be pinged when the hosted Pokémon is weather-boosted.</p>\n<hr/>\n\n</details><details><summary><span style="font-size:1.17em;margin-top:1em;margin-bottom:1em;margin-left:0;margin-right:0;font-weight:bold;display:inline-flex;" id="joining-a-raid">Joining a Raid</span></summary>\n\n<p>To join/leave a raid, simply click the <code>Join</code> and <code>Leave</code> buttons on the raid menu. Only join a raid if you have a Remote Raid Pass. To view a list of all ongoing raids, you can use <code>,raids</code>. Once you&#39;ve joined, you&#39;ll be shown the host&#39;s friend code. Open the app and add the host as a friend, and wait. When the host is ready, they&#39;ll ping all users in the raid and wait for confirmation - when you get the ping, make sure to mention that you&#39;re ready and open the app. Once everyone is ready, the host will join the raid and send invites, where they&#39;ll ping everyone again - at this point, join the raid!</p>\n<hr/>\n\n</details><details><summary><span style="font-size:1.17em;margin-top:1em;margin-bottom:1em;margin-left:0;margin-right:0;font-weight:bold;display:inline-flex;" id="hosting">Hosting</span></summary>\n\n<p>When you&#39;re ready to host a raid, follow the following steps:</p>\n<ol>\n<li>Use <code>,hostraid (Pokémon name), ...arguments</code> - this command creates a raid with you as the host. <code>arguments</code> is a list of the raid information - you can include stuff like the weather (for specific type boosts, eg: <code>Rainy</code>), slots available (eg: <code>10 slots</code>), the time before the raid despawns (eg: <code>ending in 35 minutes</code>), how long before you plan on hosting (must start with <code>hosting in</code>, eg: <code>hosting in 15 min</code>). Make sure to include the units of your time - saying <code>18</code> instead of <code>18 minutes</code> will make a raid with 18 <i>slots</i>, not 18 <i>minutes</i>. Please do not host if there&#39;s less than 5 minutes left on the raid. Eg:- <code>,hostraid Mewtwo, 35 minutes left, 5 slots, hosting in 1 min 30 sec, Cloudy weather</code> would host a weather-boosted Mewtwo raid with five free slots.</li>\n<li>If the above felt complex, even doing simply <code>,hostraid Mewtwo, Cloudy</code> is sufficient information to start a raid - the rest is just useful information to have!</li>\n<li>Wait for people to join. Make sure to only host once you have enough people - don&#39;t go in on a Lugia with 4 people and end up losing all your passes.</li>\n<li>Once you have enough people (including confirming their friend requests!), use the <code>,pingraid</code> command to ping all the users in your raid. Open the app and wait for most users to confirm their presence, then join the raid and send invites. When you&#39;ve sent the invites, use the <code>,pingraid</code> command again to let everyone know that you&#39;ve sent out invites. Note that doing so locks the raid (the same way <code>,lockraid</code> does), and you can only have users join/leave after unlocking it via <code>,unlockraid</code>.</li>\n<li>Fight in the raid! If you end up winning, make sure to do <code>,endraid</code> once you&#39;re wrapped up. Otherwise, if you lost, try to get some more people and try again (you don&#39;t need another pass to retry a raid if it&#39;s still active).</li>\n<li>If the weather changes after you start hosting the raid and you wish to change it, use the <code>,weatheris Rainy</code> command!</li></ol>\n<hr/>\n\n</details><details><summary><span style="font-size:1.17em;margin-top:1em;margin-bottom:1em;margin-left:0;margin-right:0;font-weight:bold;display:inline-flex;" id="good-practices">Good Practices</span></summary>\n\n<ul>\n<li>(Player) Once you join a raid, please send a friend request to the host, since the host is usually preoccupied with coordinating the raid.</li>\n<li>(Player) When you&#39;re waiting for the host&#39;s invite, open the Friends menu and keep opening/closing it. This forces the app to refresh your raid invites so that you don&#39;t end up missing the raid!</li>\n<li>Consult the optimal raid counters before the raid, and plan your team accordingly.</li>\n<li>(Host) Nickname all the players that you plan on inviting with the same 3/4-letter code. This way, you can type that code when you&#39;re inviting, saving you precious seconds and making it easier for people to join on time. Alternatively, you can copy the search string at the bottom of the raid box and paste it in the search to find everyone in the party.</li>\n<li>(Host) Make sure to invite when there&#39;s at least 6-7 minutes left, so that people don&#39;t miss out on the raid boss if they accidentally disconnect after the raid.</li>\n<li>Don't spam 'join my raid pls'; it doesn't help and staff may punish repeated offenses.</li>\n<li>Don&#39;t bring Aggron.</li>\n<li>Don&#39;t get into a cussing contest with Funcrank, you <i>will</i> lose.</li></ul>\n<hr/>\n\n</details></div>\n`;
		if (!isPM && tools.hasPermission(by, 'gamma', room)) Bot.say(room, `/addhtmlbox ${HTML}`);
		else if (typeof isPM === 'string') Bot.sendHTML(isPM, HTML);
		else Bot.say(room, `/sendprivatehtmlbox ${by}, ${HTML}`);
	}
};

/*

<div style="padding:20px;">

<h1 id="pok-mon-go-raid-help">Pokémon GO Raid Help</h1>

<details><summary><span style="font-size:1.17em;margin-top:1em;margin-bottom:1em;margin-left:0;margin-right:0;font-weight:bold;display:inline-flex;" id="registering">Registering</span></summary>

In order to join and host raids on PS, you'll need to register first! Simply type `,register` in chat and fill in the form with your info. You can always change your info later by filling in the form again.

<hr/>

</details><details><summary><span style="font-size:1.17em;margin-top:1em;margin-bottom:1em;margin-left:0;margin-right:0;font-weight:bold;display:inline-flex;" id="raid-list">Raid List</span></summary>

Once you've registered, you can set up your own raid list. Whenever someone hosts a raid for a Pokémon on your list, you'll receive a notification. There's four commands you can use for this:

* `,addraids (Pokémon 1), (Pokémon 2), ...` - Adds the specified Pokémon to your raid list (up to 10).
* `,removeraids (Pokémon 1), (Pokémon 2), ...` - Removes the specified Pokémon from your raid list.
* `,myraids` - Shows you your current raid list.
* `,setraids (Pokémon 1), (Pokémon 2), ...` - Overwrites your current list to the list you specify.

You can also prefix **WB** to a Pokémon name (eg:- WB Mewtwo) to only be pinged when the hosted Pokémon is weather-boosted.

<hr/>

</details><details><summary><span style="font-size:1.17em;margin-top:1em;margin-bottom:1em;margin-left:0;margin-right:0;font-weight:bold;display:inline-flex;" id="joining-a-raid">Joining a Raid</span></summary>

To join/leave a raid, simply click the `Join` and `Leave` buttons on the raid menu. Only join a raid if you have a Remote Raid Pass. To view a list of all ongoing raids, you can use `,raids`. Once you've joined, you'll be shown the host's friend code. Open the app and add the host as a friend, and wait. When the host is ready, they'll ping all users in the raid and wait for confirmation - when you get the ping, make sure to mention that you're ready and open the app. Once everyone is ready, the host will join the raid and send invites, where they'll ping everyone again - at this point, join the raid!

<hr/>

</details><details><summary><span style="font-size:1.17em;margin-top:1em;margin-bottom:1em;margin-left:0;margin-right:0;font-weight:bold;display:inline-flex;" id="hosting">Hosting</span></summary>

When you're ready to host a raid, follow the following steps:

1. Use `,hostraid (Pokémon name), ...arguments` - this command creates a raid with you as the host. `arguments` is a list of the raid information - you can include stuff like the weather (for specific type boosts, eg: `Rainy`), slots available (eg: `10 slots`), the time before the raid despawns (eg: `ending in 35 minutes`), how long before you plan on hosting (must start with `hosting in`, eg: `hosting in 15 min`). Make sure to include the units of your time - saying `18` instead of `18 minutes` will make a raid with 18 _slots_, not 18 _minutes_. Please do not host if there's less than 5 minutes left on the raid. Eg:- `,hostraid Mewtwo, 35 minutes left, 5 slots, hosting in 1 min 30 sec, Cloudy weather` would host a weather-boosted Mewtwo raid with five free slots.
2. If the above felt complex, even doing simply `,hostraid Mewtwo, Cloudy` is sufficient information to start a raid - the rest is just useful information to have!
3. Wait for people to join. Make sure to only host once you have enough people - don't go in on a Lugia with 4 people and end up losing all your passes.
4. Once you have enough people (including confirming their friend requests!), use the `,pingraid` command to ping all the users in your raid. Open the app and wait for most users to confirm their presence, then join the raid and send invites. When you've sent the invites, use the `,pingraid` command again to let everyone know that you've sent out invites. Note that doing so locks the raid (the same way `,lockraid` does), and you can only have users join/leave after unlocking it via `,unlockraid`.
5. Fight in the raid! If you end up winning, make sure to do `,endraid` once you're wrapped up. Otherwise, if you lost, try to get some more people and try again (you don't need another pass to retry a raid if it's still active).

<hr/>

</details><details><summary><span style="font-size:1.17em;margin-top:1em;margin-bottom:1em;margin-left:0;margin-right:0;font-weight:bold;display:inline-flex;" id="good-practices">Good Practices</span></summary>

* (Player) Once you join a raid, please send a friend request to the host, since the host is usually preoccupied with coordinating the raid.
* (Player) When you're waiting for the host's invite, open the Friends menu and keep opening/closing it. This forces the app to refresh your raid invites so that you don't end up missing the raid!
* Consult the optimal raid counters before the raid, and plan your team accordingly.
* (Host) Nickname all the players that you plan on inviting with the same 3/4-letter code. This way, you can type that code when you're inviting, saving you precious seconds and making it easier for people to join on time. Alternatively, you can copy the search string at the bottom of the raid box and paste it in the search to find everyone in the party.
* (Host) Make sure to invite when there's at least 6-7 minutes left, so that people don't miss out on the raid boss if they accidentally disconnect after the raid.
* Don't bring Aggron.

<hr/>

</details></div>

*/
