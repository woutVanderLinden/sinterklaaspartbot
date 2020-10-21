# PartBot

Base code for PartBot, a Bot on Pokémon Showdown.

Features:
* Quotes module
* Hangman module
* Modular structure
* Discord processes
* Inbuilt rank system, with auth-translation
* Room-specific auth overrides
* Room-exclusive commands
* Pre-implemented demonstrations
* Alt-tracking for auth
* Various games, including Quo Vadis, Exploding Voltorb, Chess, and Blackjack.
* Joinphrases
* Fully functional website


### Setup

1. Download the project and unzip it.
1. Create a copy of config-example.js and save it as config.js. Enter the Bot prefix, Bot username, Bot password, Bot avatar, Bot status, Bot owner, and an array of rooms you'd like the Bot to join. Scroll down and add the IDs of the users that you would like to set in their respective ranks. For more details on ranks, read below.
1. Open your Terminal and enter the following:
```
npm install
node bot.js
```


If all goes well, you should get a prompt notifying you of your Bot having connected.


#### Requirements
Node.js (> Node 8.0.0)



### Auth

Rank | Permissions
-----|------------
Locked | Limited access to help commands.
None | Standard access.
Gamma | Hangman and broadcasting access.
Beta | Moderation, Tour, and Game access.
Alpha | Control and Edit access.
Coder | Code, Maintainence access.
Admin | Complete access.


Auth | Rank
-----|-----
 \+ | Gamma
 \%, $, - | Beta
 \*, @, #, &, ~ | Alpha (~ is still supported for sideservers)


For room-specific authority, edit the ./data/DATA/roomauth.json file, and add the auth as a property of the room key (it already has an example).


### Structure
PartBot has the following structure:
1. All responses from PS are captured and emitted in client.js.
2. bot.js is the primary file, and contains the handler for PMs. It also initializes the PS client, the Discord client, and the website, apart from redirecting the handlers for Chat, Discord, the website, ChatError, Join, Pop-up, ChatSuccess, Tour, and Raw. This file also requires global.js.
3. Chat is handled in ./chat.js. Chat commands are stored in the ./commands folder, but are in various subdirectories. For each command, two directories are scanned. These are the global directory, and the room directory. This allows for certain commands to be exclusive to specific rooms, while others can be used in any room. Each command has the following keys: cooldown (time before the command can be used again in ms), permissions (minimum access level required to use the command), help (message to be displayed when the Help command is used), and commandFunction (the function that is executed when the command is called). commandFunction takes the following arguments: Bot, room, time, by, args, client. Here, Bot is the global Bot object, room is the ID of the room, time is the time when the message was sent, by is the name (including rank) of the user who used the comman, args is an array of the command arguments (message split on space), and client is the Discord client.
4. All PM commands are stored in a single ./pmcommands directory. Each command has the following keys: permissions, help, and commandFunction. commandFunction takes the following arguments: Bot, by, args, client.
5. ./minorhandler.js handles the emits for ChatError, Join, Pop-up, ChatSuccess, Tour, and Raw. The arguments for these can be found in client.js.
6. ./discord.js handle the Discord part of the Bot. Commands are stored in ./discord, and each command has the commandFunction with arguments `args`, `message`, and `Bot`. Other keys on the command object include `pm` (set as true to enable the command in DMs, or set as a function to run instead of commandFunction in DMs), admin (Boolean for whether the command is admin-only), help, and guildOnly (restricts the command to the given guild ID / array of guild IDs).
7. ./autores.js handles autoresponses. Simply edit the initial array check to add the room ID in order to enable autores for the room.
8. ./data/tools.js has the major tools that are used throughout the Bot's code. tools is a global object that can be used to call a tool anywhere, and also defines most prototypes.


### Globals
PartBot's code has a variety of global variables, all of which can be found from global.js. Commonly used ones include:
1. ``toId``: The single most-used function in PartBot's code. Coverts a string input to its ID.
1. ``unxa``: "Unexpected number of arguments."
1. ``tools``: A global object with various useful functions. Go through ``./data/tools.js`` to view / edit them.
1. ``data``: A global object that stores most of the data (Pokedex, moves, etc). Check the requires in ``./globals.js`` to view the individual sources, which are mstly in ``./data/DATA``.
1. ``Bot``: The PS client. The class is defined in ``./client.js``, but the instance is global. Primary functions include ``Bot.say(roomid, text)`` and ``Bot.pm(userid, text)``. State is mostly stored under various keys in the main object, and room data can be found in ``Bot.rooms``. Most games are assigned to the ``Bot.rooms[roomid]`` object. (The other clients are ``client`` (Discord) and ``app`` (website), but neither of those are globally scoped.)


### Discord Setup
While PartBot's Discord handler is still in the works, you can easily add one.
Once you've set up the configuration file, there are still a couple steps left to set up Discord. If you have ``useDiscord`` set to false, ignore these steps.
1. Open ./discord.js and replace the string ``'ADMIN_ID'`` with your Discord ID.

(Yeah, that was it)

#### Quick Help:
- How do I get the token for my Bot?

  First, open the [Discord Developer Portal](https://discord.com/developers). If you haven't already done so, create an Application and set it up. After converting the application to a Bot, go to the Bot section and copy your token. This token grants access to your application, so keep it private.

- How do I get my Discord ID?

  Go to Discord settings and enable Developer Mode. Once enabled, right click your name and copy the ID.

- How do I invite my Bot to a server?

  You can only invite the Bot to servers in which you have the ``Manage Server`` permission. Open your application on the Discord Developer Portal, and go to OAuth2. In Scopes, select Bot, and scroll down to select the relevant permissions. After this, simply visit the link that pops up below Scopes. This link may be shared and used multiple times.


### Shop / Leaderboard
PartBot has a fully-functioning Shop feature that supports two currencies.

To enable the Shop, you first need to add the relevant .json file as ./data/SHOPS/(room).json. This must be an object with the following keys:
 - img: ``{src: string}`` - This is the image that will be displayed whenever someone opens the Shop.
 - spc: ``[string, string, string]`` - This is an array with three elements: The first is the singular of the special currency, the second is the plural of the special currency, and the third is the abbreviation of the special currency. For example, for a special currency called the Dollar, this would be ``["Dollar", "Dollars", "$"]``.
 - points: ``[string, string, string]`` - This is the same as spc, but for the regular currency.
 - channel: ``string`` - This is the ID of the Discord channel in which purchases are noted. If there is no Discord, it is recommended that the buyitem command be modified.
 - users: ``{...userid: {name: string, points: [number, number]}}`` - This is an object that stores all the points that users have. points is an array with the first term containing the number of regular points, and the second containing the number of special points.
 - inventory: ``{...itemid: {name: string, cost: [number, number], id: string}}`` - This is an object that stores all the items in the shop. id is a string that is the value of itemid, and the cost contains the cost of the item in both currencies.
 - jpl: ``[...userid]`` - jpl is an array that contains the user IDs of all users who are permitted to have a joinphrase in the room. If this does not exist, this check is bypassed.

As of now, the Leaderboard is directly tied to the Shop - you can't have the leaderboard without a Shop in the room. A proper leaderboard system is in the works, though.
 
 
#### To-do:

 - [ ] Implement warmup.
 - [ ] Add moderation / promotion commands.
 - [ ] Add CONTRIBUTING.md.
 - [ ] Add independent leaderboard. (Written, needs to be merged)
 - [ ] Add proper website navigation.
 - [ ] Add GAMES.md.
 
 
 ### Credits:
 PartMan - Lead Developer
 
 Ecuacion - client.js base
 
 Morfent, JetOU, JumboWhales, XpRienzo - Various aid and contributions.
