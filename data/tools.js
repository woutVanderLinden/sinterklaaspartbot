/************************
*       Utility         *
************************/

/*exports.splead = function (text) {
    if (!(typeof text === 'string')) return null;
    while (/[0-9]/.test(text.charAt(0)) && text.length) text = text.substr(1);
    return text;
}*/

exports.quoteParse = function (quote) {
    return quote.split('\n').map(text => {
        if (!text) return;
        if (/^(|\[[0-2][0-9](\:[0-5][0-9]){1,2}\] )(|[\☆\-\$\+\%\@\*\#\&\~])[0-9A-Za-z][^\:]{1,17}\: .{1,}/.test(text)) {
            let first = text.match(/^(|\[[0-2][0-9](\:[0-5][0-9]){1,2}\] )(|[\☆\-\$\+\%\@\*\#\&\~])[0-9A-Za-z]/)[0];
            let subm = first.match(/(|[\☆\-\$\+\%\@\*\#\&\~])[0-9A-Za-z]$/)[0].length;
            let second = text.substr(first.length - subm);
            let third = second.match(/^(|[\☆\-\$\+\%\@\*\#\&\~])[0-9A-Za-z][^\:]{1,17}\:/)[0];
            let rank = ((['☆', '-', '$', '+', '%', '@', '*', '#', '&', '~'].includes(third[0])) ? (third[0]) : '');
            return '<DIV class="chat chatmessage-partbot"><SMALL>' + first.substr(0, first.length - subm) + rank + '</SMALL>' + tools.colourize(third.substr(rank.length)) + '<EM>' + second.substr(third.length) + '</EM></DIV>';
        }
        if (/^(|\[[0-2][0-9](\:[0-5][0-9]){1,2}\] )• (|[\☆\-\$\+\%\@\*\#\&\~])\[[A-Za-z0-9][^\:]{1,17}\] .{1,}/.test(text)) {
            let darr = text.split('• ');
            let time = darr.shift();
            let first = darr.join('• ');
            let rank = ((['☆', '-', '$', '+', '%', '@', '*', '#', '&', '~'].includes(first[0])) ? (first[0]) : '');
            let name = first.substr(rank.length + 1).split(']')[0];
            let stuff = first.substr(name.length + 2 + rank.length);
            return '<DIV class="chat chatmessage-partbot"><SMALL>' + time + '</SMALL>' + tools.colourize('• ', name) + '<EM><SMALL>' + rank + '</SMALL>' + name + '<I>' + stuff + '</I></EM></DIV>';
        }
        if (/^((?:(?:|[☆+%@*#&~$-])[a-zA-Z0-9][^;]* joined)|(?:(?:|[☆+%@*#&~$-])[a-zA-Z0-9][^;]* left)|(?:(?:|[☆+%@*#&~$-])[a-zA-Z0-9][^;]* joined); (?:(?:|[☆+%@*#&~$-])[a-zA-Z0-9][^;]* left))$/.test(text)) {
            return '<DIV class="message"><SMALL style="color: #555555"> ' + text + '<BR></SMALL></DIV>';
        }
        return text + '<BR>';
    }).join('');
}

exports.grantPseudo = function (user) {
    let rank = user.charAt(0);
    let name = toId(user);
    let preAuth = tools.rankLevel(user) - 2;
    switch (rank) {
        case '~': case '&': case '#': case '@': case '*': case '☆':
            if (!preAuth) pseudoalpha.push(toId(user));
            break;
        case '%': case '-': case '$':
            if (!preAuth) pseudobeta.push(toId(user));
            break;
        case '+':
            if (!preAuth) pseudogamma.push(toId(user));
            break;
        default:
            break;
    }
    return;
}

exports.commandAlias = function (alias) {
    let aliasDB = JSON.parse(String(fs.readFileSync('./data/ALIASES/commands.json')));
    if (aliasDB[toId(alias)]) alias = aliasDB[toId(alias)];
    return toId(alias);
}

exports.Matrix = require('./matrix.js').Matrix;

exports.spliceRank = function (user) {
    let rank = user.charAt(0);
    let name = toId(user);
    switch (rank) {
        case '~': case '&': case '#': case '@': case '*': case '☆':
            if (pseudoalpha.includes(name)) pseudoalpha.splice(pseudoalpha.indexOf(name), 1);
            break;
        case '%': case '-': case '$':
            if (pseudobeta.includes(name)) pseudobeta.splice(pseudobeta.indexOf(name), 1);
            break;
        case '+':
            if (pseudogamma.includes(name)) pseudogamma.splice(pseudogamma.indexOf(name), 1);;
            break;
        default:
            break;
    }
}

exports.rankLevel = function (user) {
    let auth = 0;
    if (admin.includes(toId(user)) || adminalts.includes(toId(user))) auth = 10;
    else if (coder.includes(toId(user)) || coderalts.includes(toId(user))) auth = 9;
    else if (locked.includes(toId(user)) || lockedalts.includes(toId(user))) auth = 1;
    else if (alpha.includes(toId(user)) || alphaalts.includes(toId(user)) || pseudoalpha.includes(toId(user))) auth = 5;
    else if (beta.includes(toId(user)) || betaalts.includes(toId(user)) || pseudobeta.includes(toId(user))) auth = 4;
    else if (gamma.includes(toId(user)) || gammaalts.includes(toId(user)) || pseudogamma.includes(toId(user))) auth = 3;
    else auth = 2;
    return auth;
}

exports.hasPermission = function (user, rank) {
    let auth = tools.rankLevel(user);
    let req;
    switch (rank) {
        case 'admin': 
            req = 9;
            break;
        case 'coder': 
            req = 8;
            break;
        case 'alpha': 
            req = 4;
            break;
        case 'beta':
            req = 3;
            break;
        case 'gamma': 
            req = 2;
            break;
        case 'none': 
            req = 1;
            break;
        case 'locked': 
            req = 0;
            break;
        default: 
            req = 0;
    }
    if (auth > req) return true;
    else return false;
}

exports.listify = function (array) {
    if (!Array.isArray(array)) return array;
    let tarr = array;
    let tarre = false;
    if (tarr.length > 1) tarre = tarr.pop();
    return tarr.join(', ')+((array.length>1)?', and '+tarre:((tarre)?' and '+tarre:''));
}

exports.uploadToHastebin = function (text, callback) {
    if (typeof callback !== 'function') return false;
    let action = url.parse('https://hastebin.com/documents');
    let options = {
        hostname: action.hostname,
        path: action.pathname,
        method: 'POST',
    };

    let request = https.request(options, response => {
        response.setEncoding('utf8');
        let data = '';
        response.on('data', chunk => {
            data += chunk;
        });
        response.on('end', () => {
            let key;
            try {
                let pageData = JSON.parse(data);
                key = pageData.key;
            } catch (e) {
                if (/^[^<]*<!DOCTYPE html>/.test(data)) {
                    if (e.message === 'Unexpected token < in JSON at position 0') return callback('Hastebin is wonky at the moment. Surprisingly, this isn\'t PartMan\'s fault.');
                    return callback('Cloudflare-related error uploading to Hastebin: ' + e.message);
                } else {
                    return callback('Unknown error uploading to Hastebin: ' + e.message);
                }
            }
            callback('https://hastebin.com/raw/' + key);
        });
    });

    request.on('error', error => console.log('Login error: ' + error.stack));

    if (text) request.write(text);
    request.end();
}

exports.warmup = function (room, commandName) {
    if (!cooldownObject[room] || !cooldownObject[room][commandName]) return;
    cooldownObject[room][commandName] = false;
    return;
}

exports.setCooldown = function (commandName, room, commandRequire) {
    if (!commandRequire || !commandName || !(typeof commandName === 'string') || !(typeof commandRequire === 'object') || Array.isArray(commandRequire)) return;
    if (!commandRequire.cooldown) commandRequire.cooldown = 10000;
    if (!cooldownObject[room]) cooldownObject[room] = {};
    cooldownObject[room][commandName] = true;
    setTimeout(tools.warmup, commandRequire.cooldown, room, commandName);
    return;
}

exports.scrabblify = function (text) {
    if (!typeof text === 'string') return 0;
    let tarr = text.toUpperCase().split('');
    function points(letter) {
        if (!typeof letter === 'string' || !letter.length === 1) return 0;
        if ('EAOTINRSLU'.includes(letter)) return 1;
        else if ('DG'.includes(letter)) return 2;
        else if ('CMBP'.includes(letter)) return 3;
        else if ('HFWYV'.includes(letter)) return 4;
        else if ('K'.includes(letter)) return 5;
        else if ('JX'.includes(letter)) return 8;
        else if ('ZQ'.includes(letter)) return 10;
        else return 0;
    }
    return tarr.reduce((x, y) => {return x + points(y)}, 0);
}

exports.toName = function (username) {
    username = toId(username);
    switch (username) {
        case 'partman': case 'vampart': return 'vamPart'; break;
        case 'tapiocatopic': return 'TapiocaTopic'; break;
        case 'unleashourpassion': return 'UnleashOurPassion'; break;
        case 'ironcrusher': return 'Iron Crusher'; break;
        case 'toppytopic': return 'ToppyTopic'; break;
        case '1v1sp': return '1v1sp'; break;
        case 'yeche': return 'Yech E'; break;
        case 'allfourtyone': return 'AllFourtyOne'; break;
        case 'vgjungle': return 'VG Jungle'; break;
        case 'theseelgoesmeow': return 'TheSeelGoesMeow'; break;
        case 'tlouk': return 'tlouk'; break;
        case 'armaldlo': return 'armaldlo'; break;
        case 'oceaney': return 'Ocean-ey'; break;
        case '666lesbian69': return '666lesbian69'; break;
        case 'tallydaorangez': return 'tallydaorangez=>'; break;
        case 'ayedan': return 'ayedan'; break;
        case 'princessnature': return 'Princess Nature'; break;
        case 'gmfc': return 'gmfc'; break;
        case 'malcolm24': return 'malcolm24'; break;
        case 'devourerofthots': return 'Devourer of Thots'; break;
        case 'suspectphilosophy': return 'Suspect Philosophy'; break;
        case 'vrbot': return 'VRBot'; break;
        case 'typebot': return 'TypeBot'; break;
        case 'snekbot': return 'SnekBot'; break;
        case 'uopisbot': return 'UOP is Bot'; break;
        case 'partbot': return 'PartBot'; break;
        case '1v1ombot': return '1v1 OM Bot'; break;
        case 'orangealte': return 'OrangeAlte'; break;
        case 'theimmortal': return 'The Immortal'; break;
        default: return username.charAt(0).toUpperCase() + username.substr(1);
    }
}

exports.colourize = function (text, name, useOriginal) {
    let ccjs = JSON.parse(String(fs.readFileSync('./data/DATA/customcolors.json')));
    let typejs = JSON.parse(String(fs.readFileSync('./data/DATA/typecolors.json')));
    if (!name) name = toId(text);
    if (Object.keys(typejs).includes(toId(name)) && !useOriginal) return `<STRONG style="color:#${typejs[toId(name)]}">${text}</STRONG>`;
    if (Object.keys(ccjs).includes(toId(name)) && !useOriginal) name = ccjs[name];
    let md5 = require('js-md5');
    let hash = md5(toId(name));
    let H = parseInt(hash.substr(4, 4), 16) % 360;
    let S = parseInt(hash.substr(0, 4), 16) % 50 + 40;
    let L = Math.floor(parseInt(hash.substr(8, 4), 16) % 20 + 30);
    let C = (100 - Math.abs(2 * L - 100)) * S / 100 / 100;
    let X = C * (1 - Math.abs((H / 60) % 2 - 1));
    let m = L / 100 - C / 2;
    let R1;
    let G1;
    let B1;
    switch (Math.floor(H / 60)) {
    case 1: R1 = X; G1 = C; B1 = 0; break;
    case 2: R1 = 0; G1 = C; B1 = X; break;
    case 3: R1 = 0; G1 = X; B1 = C; break;
    case 4: R1 = X; G1 = 0; B1 = C; break;
    case 5: R1 = C; G1 = 0; B1 = X; break;
    case 0: default: R1 = C; G1 = X; B1 = 0; break;
    }
    let R = R1 + m;
    let G = G1 + m;
    let B = B1 + m;
    let lum = R * R * R * 0.2126 + G * G * G * 0.7152 + B * B * B * 0.0722;
    let HLmod = (lum - 0.2) * -150;
    if (HLmod > 18) HLmod = (HLmod - 18) * 2.5;
    else if (HLmod < 0) HLmod = (HLmod - 0) / 3;
    else HLmod = 0;
    let Hdist = Math.min(Math.abs(180 - H), Math.abs(240 - H));
    if (Hdist < 15) {
        HLmod += (15 - Hdist) / 3;
    }
    L += HLmod;
    return '<STRONG style=\"' + `color:hsl(${H},${S}%,${L}%);` + '\">' + text + '</STRONG>';
}

exports.modeArray = function (arr) {
    if (!Array.isArray(arr)) return;
    let arrObj = {};
    arr.forEach(elem => {
        if (!arrObj['elem' + elem]) arrObj['elem' + elem] = 1;
        else arrObj['elem' + elem]++;
    });
    let maxF = Object.values(arrObj).sort((a, b) => b - a)[0];
    return Object.keys(arrObj).filter(elem => (arrObj[elem] == maxF)).map(elem => elem.substr(4)).sort();
}

exports.humanTime = function (millis) {
    if (typeof millis === 'string') millis = parseInt(millis);
    if (!(typeof millis === 'number')) return;
    let time = {};
    time.year = Math.floor(millis / (365*24*60*60*1000));
    millis %= (365*24*60*60*1000);
    time.week = Math.floor(millis / (7*24*60*60*1000));
    millis %= (7*24*60*60*1000);
    time.day = Math.floor(millis / (24*60*60*1000));
    millis %= (24*60*60*1000);
    time.hour = Math.floor(millis / (60*60*1000));
    millis %= (60*60*1000);
    time.minute = Math.floor(millis / (60*1000));
    millis %= (60*1000);
    time.second = Math.floor(millis / (1000));
    millis %= (1000);
    time.millisecond = millis;
    let output = [];
    let foundFirst = false;
    let foundSecond = false;
    Object.keys(time).forEach(val => {
        if (foundFirst && !foundSecond) {
            if (time[val] === 0);
            else output.push(time[val] + ' ' + val + ((time[val] === 1)?'':'s'));
            foundSecond = true;
        }
        else {
            if (time[val] && !foundSecond) {
                foundFirst = true;
                output.push(time[val] + ' ' + val + ((time[val] === 1)?'':'s'));
            }
        }
    });
    return output.join(' and ');
}

exports.getSetsFrom = function (link) {
    switch (link.split('.')[0]) {
        case 'pokepast': {
            (link.endsWith('/json')) ? link : link += '/json';
            require('request')(link, (error, response, body) => {
                if (error) throw error;
                let data = JSONS.parse(body).paste;
                return data.replace(/\r\n/g, '');
            });
        }
    }
    return output;
}


/************************
*     Prototypes        *
************************/

String.prototype.replaceAll = function (text, repl) {
    if (!typeof text === 'string' || !typeof repl === 'string') return;
    return this.split(text).join(repl);
}

String.prototype.frequencyOf = function (text) {
    if (!typeof text === 'string') return;
    return this.split(text).length - 1;
}