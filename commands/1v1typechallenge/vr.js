module.exports = {
    cooldown: 1000,
    help: `Displays the VR for a type.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0]) return Bot.say(room, unxa);
        if (args[1]) return Bot.say(room, unxa);
        let giventype = args[0].toLowerCase();
        if (!typelist.includes(giventype)) return Bot.say(room, 'Type not found.');
        let ftype = require(`../../data/VR/TC/${giventype}.js`)[giventype];
        let etype = require('../../data/EXPERTS/tc.js')[giventype];
        let tbdis = ['sp', 's', 'sm', 'ap', 'a', 'am', 'bp', 'b', 'bm', 'cp', 'c', 'cm', 'd', 'unt', 'e'];
        let pctbdis = [];
        tbdis.forEach(function(element) {
          if (ftype[element] == "undefined") return;
          if (ftype[element].length == 0) return;            
          pctbdis.push(element);
        });
        let ftr = [];
        var texpert = '';
        var bans = '';
        if (pctbdis.includes('sp')) ftr.push('S+: ' + ftype.sp.join(', '));
        if (pctbdis.includes('s')) ftr.push('S: ' + ftype.s.join(', '));
        if (pctbdis.includes('sm')) ftr.push('S-: ' + ftype.sm.join(', '));
        if (pctbdis.includes('ap')) ftr.push('A+: ' + ftype.ap.join(', '));
        if (pctbdis.includes('a')) ftr.push('A: ' + ftype.a.join(', '));
        if (pctbdis.includes('am')) ftr.push('A-: ' + ftype.am.join(', '));
        if (pctbdis.includes('bp')) ftr.push('B+: ' + ftype.bp.join(', '));
        if (pctbdis.includes('b')) ftr.push('B: ' + ftype.b.join(', '));
        if (pctbdis.includes('bm')) ftr.push('B-: ' + ftype.bm.join(', '));
        if (pctbdis.includes('cp')) ftr.push('C+: ' + ftype.cp.join(', '));
        if (pctbdis.includes('c')) ftr.push('C: ' + ftype.c.join(', '));
        if (pctbdis.includes('cm')) ftr.push('C-: ' + ftype.cm.join(', '));
        if (pctbdis.includes('d')) ftr.push('D: ' + ftype.d.join(', '));
        if (pctbdis.includes('e')) ftr.push('E: ' + ftype.e.join(', '));
        if (pctbdis.includes('unt')) ftr.push('Untiered: ' + ftype.unt.join(', '));
        if (etype.length == 1) texpert = `Expert: ${tools.colourize(tools.toName(etype[0]))}`;
        else if (etype.length == 0) texpert = 'Experts: None';
        else {
            let earr = etype.sort().map(exp => tools.colourize(tools.toName(exp)));
            texpert = `Experts: ${earr.join(', ')}`;
        }
        if (ftype.bans.length == 0) bans = 'None';
        else bans = ftype.bans.join(', ');
        let outstr = `<DETAILS><SUMMARY>${tools.colourize(tools.toName(args[0].toLowerCase()) + ' VR', args[0])}</SUMMARY><HR>${ftr.join('<BR>')}<BR><BR>Bans: ${bans}<BR><BR>${texpert}</DETAILS>`;
        if (tools.hasPermission(by, 'gamma')) Bot.say(room, `/addhtmlbox ` + outstr);
        else Bot.say(room, '/pminfobox ' + by + ', ' + outstr);
    }
}