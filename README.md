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
* Logs
* Alt-tracking for auth
* Various games, including Quo Vadis, Exploding Voltorb, and Blackjack.
* Joinphrases
* Fully functional website


### Setup

1. Download the project and unzip it.
1. Navigate to config.js and enter the Bot prefix, Bot username, Bot password, Bot avatar, Bot status, Bot owner, and an array of rooms you'd like the Bot to join. Scroll down and add the IDs of the users that you would like to set in their respective ranks. For more details on ranks, read below.
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
 \*, @, #, &, ~ | Alpha


For room-specific authority, edit the ./data/DATA/roomauth.json file, and add the auth as a property of the room key (it already has an example).


### Structure
PartBot has the following structure:
1. All responses from PS are captured and emitted in client.js.
2. bot.js is the primary file, and contains the handlers for Chat and PMs. It also initializes the PS client, the Discord client, and the website, apart from redirecting the handlers for Discord, the website, ChatError, Join, Pop-up, ChatSuccess, Tour, and Raw. This file also requires global.js.
3. Chat commands are stored in the ./commands folder, but are in various subdirectories. For each command, two directories are scanned. These are the global directory, and the room directory. This allows for certain commands to be exclusive to specific rooms, while others can be used in any room. Each command has the following keys: cooldown (time before the command can be used again in ms), permissions (minimum access level required to use the command), help (message to be displayed when the Help command is used), and commandFunction (the function that is executed when the command is called). commandFunction takes the following arguments: Bot, room, time, by, args, client. Here, Bot is the global Bot object, room is the ID of the room, time is the time when the message was sent, by is the name (including rank) of the user who used the comman, args is an array of the command arguments (message split on space), and client is the Discord client.
4. All PM commands are stored in a single ./pmcommands directory. Each command has the following keys: permissions, help, and commandFunction. commandFunction takes the following arguments: Bot, by, args, client.
5. minorhandler.js handles the emits for ChatError, Join, Pop-up, ChatSuccess, Tour, and Raw. The arguments for these can be found in client.js.
6. discord.js handles the Discord messages, for now. A proper handler is in the works.
7. chat.js handles autoresponses. Simply edit the initial array check to add the room ID in order to enable autores for the room.
8. data/tools.js has the major tools that are used throughout the Bot's code. tools is a global object that can be used to call a tool anywhere.


### Shop
PartBot has a fully-functioning Shop feature that supports two currencies.

To enable the Shop, you first need to add the relevant .json file as ./data/SHOPS/(room).json. This must be an object with the following keys:
 - img: ``{src: string}`` - This is the image that will be displayed whenever someone opens the Shop.
 - spc: ``[string, string, string]`` - This is an array with three elements: The first is the singular of the special currency, the second is the plural of the special currency, and the third is the abbreviation of the special currency. For example, for a special currency called the Dollar, this would be ``["Dollar", "Dollars", "$"]``.
 - points: ``[string, string, string]`` - This is the same as spc, but for the regular currency.
 - channel: ``string`` - This is the ID of the Discord channel in which purchases are noted. If there is no Discord, it is recommended that the buyitem command be modified.
 - users: ``{...userid: {name: string, points: [number, number]}}`` - This is an object that stores all the points that users have. points is an array with the first term containing the number of regular points, and the second containing the number of special points.
 - inventory: ``{...itemid: {name: string, cost: [number, number], id: string}}`` - This is an object that stores all the items in the shop. id is a string that is the value of itemid, and the cost contains the cost of the item in both currencies.
 - jpl: ``[...userid]`` - jpl is an array that contains the user IDs of all users who are permitted to have a joinphrase in the room. If this does not exist, this check is bypassed.
 
 
#### To-do:
 - [x] Fix permissions issues.
 - [x] Implement Bot avatars.
 - [x] Implement Bot status.
 - [x] Add room-specific commands.
 - [x] Use EventEmitter.
 - [x] Fix authalts.
 - [x] Fix Bot.rooms\[].rank.
 - [x] Add Bot.rooms\[].title
 - [ ] Handle canHTML cases in all commands.
 - [ ] Implement warmup.
 - [x] Add blocks for newly installed / unconfigured projects.
 - [x] Add better help messages.
 - [x] Add room-specific auth.
 - [ ] Add moderation / promotion commands.
 - [x] Implement Tour tracking.
 - [x] Complete all command alternatives for roomrank.
 - [x] Implement PM commands.
 - [ ] Add CONTRIBUTING.md.
 - [ ] Complete the Chess module.
 - [x] Complete the Exploding Voltorb module.
 - [x] Add a leaderboard renderer.
 - [x] Implement a Shop / Currency feature.
 - [ ] Implement a Discord command handler.
 - [ ] Uodate code to include recent changes.

 
 
 
 ### Credits:
 PartMan - Lead Developer, Administrator
 
 Ecuacion - client.js base
 
 Morfent, JetOU, JumboWhales, tlouk, XpRienzo - Making sure PartMan doesn't ruin the Bot with terrible code.
