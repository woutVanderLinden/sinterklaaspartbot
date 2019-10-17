# PartBot

Base code for PartBot, a Bot on Pokémon Showdown.

Features:
* Quotes module
* Hangman module
* Modular structure
* Discord processes
* Inbuilt rank system, with auth-translation
* Room-exclusive commands
* Pre-implemented demonstrations
* Logs
* Alt-tracking for auth


### Setup:

1. Download the project and unzip it.
1. Navigate to config.js and enter the Bot prefix, Bot username, Bot password, Bot avatar, Bot status, Bot owner, and an array of rooms you'd like the Bot to join.
1. Navigate to global.js and scroll to the Ranks section (for more details on ranks, scroll down).
1. Open your Terminal and enter the following:
```
npm install
node bot.js
```


If all goes well, you should get a prompt notifying you that your Bot has connected.


#### Requirements
Node.js (> Node 8.0.0)


Rank | Permissions
-----|------------
Locked | Limited access to help commands.
None | Standard access.
Gamma | Hangman, broadcasting access.
Beta | Moderation, Tour, Edit access.
Alpha | Control access.
Coder | Code, Maintainence access.
Admin | Complete access.


Auth | Rank
-----|-----
\ | None
 + | Gamma
 %, $, - | Beta
 \*, @, #, &, ~ | Alpha
 
 
 #### To-do:
 - [x] Fix permissions issues.
 - [x] Implement Bot avatars.
 - [x] Implement Bot status.
 - [x] Add room-specific commands.
 - [x] Use EventEmitter.
 - [x] Fix authalts.
 - [x] Fix Bot.rooms\[].rank.
 - [ ] Implement warmup.
 - [ ] Add blocks for newly installed / unconfigured projects.
 - [ ] Add better help messages.
 - [ ] Add room-specific auth.
 - [ ] Add moderation / promotion commands.
 - [ ] Fix Bot.rooms\[].tourActive.
 - [ ] Implement Tour tracking.
 - [ ] Complete all command alternatives for roomrank.
 - [ ] Implement PM commands.
 
 
 
 
 ### Credits:
 PartMan - Developer, Administrator
 Ecuacion - client.js base
 1v1sp, armaldlo, tallydaorangez - 1v1 Type Challenge Resources
 Morfent, JetOU, JumboWhales, tlouk, XpRienzo - Making sure PartMan doesn't ruin the Bot with terrible code.
