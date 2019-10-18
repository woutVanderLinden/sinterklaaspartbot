# Protocols for PartBot

### Bot is the main instance of the PS! client.
Bot has the following prototypes:

* Bot.init() - starts / retries connecting to the PS! server
* Bot.connect(retry) - connects to the PS! server
* Bot.say(room, text) - says (text) in (room)
* Bot.pm(user, text) - sends (user) a PM with the content (text)
* Bot.log(text) - logs (text) in logs.txt and in the console.
