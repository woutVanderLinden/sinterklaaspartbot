module.exports = {
  cooldown: 1000,
  help: `PartBot's quotes module.`,
  permissions: "none",
  commandFunction: function(Bot, room, time, by, args, client) {
    let qfol = "./data/QUOTES/" + room;
    let exec = args[0] || "random";
    if (!Bot.rooms[room].rank)
      return Bot.say(room, "Lemme get stuff set up, first.");
    switch (Bot.rooms[room].rank) {
      case "*":
      case "#":
      case "&":
      case "~":
      case '★': {
        switch (exec) {
          case "add": {
            if (!tools.hasPermission(by, "beta", room))
              return Bot.say(room, "Access denied.");
            args.shift();
            if (!args[0]) return Bot.say(room, unxa);
            let inite = args.join(" ").split("\\n");
            let addstr = "";
            inite.forEach(line => {
              addstr += /^ /.test(line) ? "\n" + line.substr(1) : "\n" + line;
            });
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + tcroom + ".txt", "utf8")
            );
            qArr.push(addstr);
            fs.writeFile(
              "./data/QUOTES/" + tcroom + ".txt",
              JSON.stringify(qArr, null, 2),
              e => {
                if (e) return Bot.log(e);
                Bot.say(room, "Quote has been added.");
                return Bot.log(
                  by.substr(1) + " added a quote in " + tcroom + ": \n" + addstr
                );
              }
            );
            break;
          }
          case "preview": {
            args.shift();
            if (!args[0]) return Bot.say(room, unxa);
            let inite = args.join(" ").split("\\n");
            let addstr = "";
            inite.forEach(line => {
              addstr += tools.quoteParse(
                /^ /.test(line) ? line.substr(1) : line
              );
            });
            if (tools.hasPermission(by, "gamma", room))
              return Bot.say(room, "/adduhtml QUOTE, <HR>" + addstr + "<HR>");
            else return Bot.say(room, "/pminfobox " + by + ", " + addstr);
            break;
          }
          case "list": {
            if (!tools.hasPermission(by, "gamma", room))
              return Bot.say(room, "Access denied.");
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + tcroom + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            let outstr = "";
            qArr.forEach(quote => {
              outstr +=
                "<DETAILS><SUMMARY>Q" +
                (qArr.indexOf(quote) + 1) +
                ": </SUMMARY><HR>" +
                tools.quoteParse(quote) +
                "<HR></DETAILS><BR>";
            });
            return Bot.say(
              room,
              "/adduhtml QUOTE, <DETAILS><SUMMARY>Quotes</SUMMARY><HR>" +
                outstr +
                "<HR></DETAILS>"
            );
            break;
          }
          case "delete": {
            if (!tools.hasPermission(by, "beta", room))
              return Bot.say(room, "Access denied.");
            if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            if (!args[1]) return Bot.say(room, unxa);
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + tcroom + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            args.splice(0, 1);
            let gno = parseInt(args.join(" ").replace(/[^0-9]/g, ""));
            if (isNaN(gno) || gno > qArr.length || gno < 1)
              return Bot.say(room, "Invalid quote number.");
            let delstr = qArr[gno - 1];
            qArr.splice(gno - 1, 1);
            fs.writeFile(
              "./data/QUOTES/" + tcroom + ".txt",
              JSON.stringify(qArr, null, 2),
              e => {
                if (e) return Bot.log(e);
                Bot.say(room, "Quote has been deleted.");
                return Bot.log(
                  by.substr(1) + " deleted a quote in " + tcroom + ": \n" + delstr
                );
              }
            );
            break;
          }
          case "amt":
          case "amount": {
            if (!fs.readdirSync("./data/QUOTES").includes(tcroom + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + tcroom + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            return Bot.say(room, "This room has " + qArr.length + " quotes.");
            break;
          }
          case "find":
          case "search": {
            if (!tools.hasPermission(by, "gamma", room))
              return Bot.say(room, "Access denied.");
            if (!fs.readdirSync("./data/QUOTES").includes(tcroom + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + tcroom + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            if (!(args.length - 1)) return Bot.say(room, unxa);
            args.splice(0, 1);
            let key = args.join(" ").toLowerCase();
            let fArr = qArr.filter(quote => quote.toLowerCase().includes(key));
            let outstr = "";
            fArr.forEach(quote => {
              outstr +=
                "<DETAILS><SUMMARY>Q" +
                (qArr.indexOf(quote) + 1) +
                ": </SUMMARY><HR>" +
                tools.quoteParse(quote) +
                "<HR></DETAILS><BR>";
            });
            if (!outstr) return Bot.say(room, "No quotes found.");
            return Bot.say(
              room,
              "/adduhtml QUOTE, <DETAILS><SUMMARY>Quotes</SUMMARY><HR>" +
                outstr +
                "<HR></DETAILS>"
            );
            break;
          }
          default: {
            let ano;
            if (!fs.readdirSync("./data/QUOTES").includes(tcroom + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + tcroom + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            if (exec == "random" || exec == "r")
              ano = Math.floor(Math.random() * qArr.length + 1);
            if (!ano) ano = parseInt(args.join(" ").replace(/[^0-9]/g, ""));
            if (isNaN(ano) || ano < 1 || ano > qArr.length)
              return Bot.say(room, "Invalid quote number.");
            let qtext = tools.quoteParse(qArr[ano - 1]);
            if (tools.hasPermission(by, "gamma", room))
              return Bot.say(room, "/adduhtml QUOTE, <HR>" + qtext + "<HR>");
            else return Bot.say(room, "/pminfobox " + by + ", " + qtext);
            break;
          }
        }
        break;
      }
      case "+":
      case "%":
      case "@":
      case "-":
      case "$":
      case "★": {
        switch (exec) {
          case "add": {
            if (!tools.hasPermission(by, "beta", room))
              return Bot.say(room, "Access denied.");
            args.shift();
            if (!args[0]) return Bot.say(room, unxa);
            let inite = args.join(" ").split("\\n");
            let addstr = "";
            inite.forEach(line => {
              addstr += /^ /.test(line) ? "\n" + line.substr(1) : "\n" + line;
            });
            if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt")) {
              fs.writeFileSync("./data/QUOTES/" + room + ".txt", "[]");
            }
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8")
            );
            qArr.push(addstr);
            fs.writeFile(
              "./data/QUOTES/" + room + ".txt",
              JSON.stringify(qArr, null, 2),
              e => {
                if (e) return Bot.log(e);
                Bot.say(room, "Quote has been added.");
                return Bot.log(
                  by.substr(1) + " added a quote in " + room + ": \n" + addstr
                );
              }
            );
            break;
          }
          case "preview": {
            args.shift();
            if (!args[0]) return Bot.say(room, unxa);
            return Bot.say(room, "[[]][[]]" + args.join(" "));
            break;
          }
          case "list": {
            return Bot.say(room, "Working on this, sorry.");
            break;
          }
          case "delete": {
            if (!tools.hasPermission(by, "beta", room))
              return Bot.say(room, "Access denied.");
            if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            if (!args[1]) return Bot.say(room, unxa);
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            args.splice(0, 1);
            let gno = parseInt(args.join(" ").replace(/[^0-9]/g, ""));
            if (isNaN(gno) || gno > qArr.length || gno < 1)
              return Bot.say(room, "Invalid quote number.");
            let delstr = qArr[gno - 1];
            qArr.splice(gno - 1, 1);
            fs.writeFile(
              "./data/QUOTES/" + room + ".txt",
              JSON.stringify(qArr, null, 2),
              e => {
                if (e) return Bot.log(e);
                Bot.say(room, "Quote has been deleted.");
                return Bot.log(
                  by.substr(1) + " deleted a quote in " + room + ": \n" + delstr
                );
              }
            );
            break;
          }
          case "amt":
          case "amount": {
            if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            if (tools.hasPermission(by, "gamma", room))
              return Bot.say(
                room,
                "This room has " +
                  qArr.length +
                  " quote" +
                  (qArr.length > 1 ? "s" : "") +
                  "."
              );
            else return Bot.pm(by, "This room has " + qArr.length + " quotes.");
            break;
          }
          case "find":
          case "search": {
            if (!tools.hasPermission(by, "gamma", room))
              return Bot.say(room, "Access denied.");
            if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            if (!(args.length - 1)) return Bot.say(room, unxa);
            args.splice(0, 1);
            let key = args.join(" ").toLowerCase();
            let fArr = qArr.filter(quote => quote.toLowerCase().includes(key));
            let outstr = [];
            fArr.forEach(quote => {
              outstr.push += "Q" + (qArr.indexOf(quote) + 1);
            });
            if (!outstr.length) return Bot.say(room, "No quotes found.");
            return Bot.say(room, "Matching quotes: " + outstr.join(", "));
            break;
          }
          default: {
            let ano;
            if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            if (exec == "random" || exec == "r")
              ano = Math.floor(Math.random() * qArr.length + 1);
            if (!ano) ano = parseInt(args.join(" ").replace(/[^0-9]/g, ""));
            if (isNaN(ano) || ano < 1 || ano > qArr.length)
              return Bot.say(room, "Invalid quote number.");
            let qtext = qArr[ano - 1].replace(/^\s*/g, "");
            if (tools.hasPermission(by, "gamma", room)) {
              if (qtext.length > 290)
                return Bot.say(
                  room,
                  "Q" + ano + " is too long for me to post, sorry."
                );
              return Bot.say(room, "[[]][[]]" + qtext);
            } else if (qtext.length > 290)
              return Bot.pm(
                by,
                "Q" + ano + " is too long for me to send, sorry."
              );
            return Bot.pm(by, qtext);
            break;
          }
        }
        break;
      }
      case " ": {
        switch (exec) {
          case "add": {
            if (!tools.hasPermission(by, "beta", room))
              return Bot.say(room, "Access denied.");
            args.shift();
            if (!args[0]) return Bot.say(room, unxa);
            let inite = args.join(" ").split("\\n");
            let addstr = "";
            inite.forEach(line => {
              addstr += /^ /.test(line) ? "\n" + line.substr(1) : "\n" + line;
            });
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + tcroom + ".txt", "utf8")
            );
            qArr.push(addstr);
            fs.writeFile(
              "./data/QUOTES/" + tcroom + ".txt",
              JSON.stringify(qArr, null, 2),
              e => {
                if (e) return Bot.log(e);
                Bot.say(room, "Quote has been added.");
                return Bot.log(
                  by.substr(1) + " added a quote in " + room + ": \n" + addstr
                );
              }
            );
            break;
          }
          case "preview": {
            args.shift();
            if (!args[0]) return Bot.say(room, unxa);
            return Bot.say(room, "[[]][[]]" + args.join(" "));
            break;
          }
          case "list": {
            return Bot.say(
              room,
              "I do not have the required auth to display the quote list. Mind promoting me, first?"
            );
            break;
          }
          case "delete": {
            if (!tools.hasPermission(by, "beta", room))
              return Bot.say(room, "Access denied.");
            if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            if (!args[1]) return Bot.say(room, unxa);
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            args.splice(0, 1);
            let gno = parseInt(args.join(" ").replace(/[^0-9]/g, ""));
            if (isNaN(gno) || gno > qArr.length || gno < 1)
              return Bot.say(room, "Invalid quote number.");
            let delstr = qArr[gno - 1];
            qArr.splice(gno - 1, 1);
            fs.writeFile(
              "./data/QUOTES/" + room + ".txt",
              JSON.stringify(qArr, null, 2),
              e => {
                if (e) return Bot.log(e);
                Bot.say(room, "Quote has been deleted.");
                return Bot.log(
                  by.substr(1) + " deleted a quote in " + room + ": \n" + delstr
                );
              }
            );
            break;
          }
          case "amt":
          case "amount": {
            if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            if (tools.hasPermission(by, "gamma", room))
              return Bot.say(
                room,
                "This room has " +
                  qArr.length +
                  " quote" +
                  (qArr.length > 1 ? "s" : "") +
                  "."
              );
            else return Bot.pm(by, "This room has " + qArr.length + " quotes.");
            break;
          }
          case "find":
          case "search": {
            if (!tools.hasPermission(by, "gamma", room))
              return Bot.say(room, "Access denied.");
            if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            if (!(args.length - 1)) return Bot.say(room, unxa);
            args.splice(0, 1);
            let key = args.join(" ").toLowerCase();
            let fArr = qArr.filter(quote => quote.toLowerCase().includes(key));
            let outstr = [];
            fArr.forEach(quote => {
              outstr.push += "Q" + (qArr.indexOf(quote) + 1);
            });
            if (!outstr.length) return Bot.say(room, "No quotes found.");
            return Bot.say(room, "Matching quotes: " + outstr.join(", "));
            break;
          }
          default: {
            let ano;
            if (!fs.readdirSync("./data/QUOTES").includes(room + ".txt"))
              return Bot.say(room, "No quotes in this room.");
            let qArr = JSON.parse(
              fs.readFileSync("./data/QUOTES/" + room + ".txt", "utf8")
            );
            if (!qArr.length) return Bot.say(room, "No quotes for this room.");
            if (exec == "random" || exec == "r")
              ano = Math.floor(Math.random() * qArr.length + 1);
            if (!ano) ano = parseInt(args.join(" ").replace(/[^0-9]/g, ""));
            if (isNaN(ano) || ano < 1 || ano > qArr.length)
              return Bot.say(room, "Invalid quote number.");
            let qtext = qArr[ano - 1].replace(/^\s*/g, "").replace("\n", "   ");
            if (tools.hasPermission(by, "gamma", room)) {
              if (qtext.length > 290)
                return Bot.say(
                  room,
                  "Q" + ano + " is too long for me to post, sorry."
                );
              return Bot.say(room, "[[]][[]]" + qtext);
            } else if (qtext.length > 290)
              return Bot.pm(
                by,
                "Q" + ano + " is too long for me to send, sorry."
              );
            return Bot.pm(by, qtext);
            break;
          }
        }
        //TODO
        break;
      }
      default: {
        Bot.say(room, "Something went wrong: invalid room rank.");
        break;
      }
    }
  }
};
