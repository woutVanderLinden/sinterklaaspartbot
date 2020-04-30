module.exports = {
    cooldown: 1000,
    help: `Creates a Hangman with the specified arguments.`,
    permissions: 'gamma',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (args[1]) return Bot.say(room, unxa);
        let hint = 'Generation: ';
        if (!args[0]);
        else {
            let arg = args[0].toLowerCase();
            if (arg === 'generation' || arg === 'gen' || arg === 'g');
            else if (arg === 'colour' || arg === 'color' || arg === 'c') hint = 'Colour: ';
            else if (arg === 'type' || arg === 'types' || arg === 't') hint = 'Type(s): ';
            else if (arg === 'bst' || arg === 'b') hint = 'BST: ';
            else if (arg === 'stat' || arg === 's') hint = ['HP: ', 'Atk: ', 'Def: ', 'SpA: ', 'SpD: ', 'Spe: '][Math.floor(Math.random()*6)];
            else if (arg === 'egg' || arg === 'e') hint = 'Egg group(s): ';
            else if (arg === 'none' || arg === 'n') hint = 'A Pokemon!';
            else return Bot.say(room, 'Unable to find requested hint.');
        }
        let pokedex = data.pokedex;
        let filDex = Object.keys(pokedex).filter(m => !pokedex[m].forme && pokedex[m].num > 0);
        let mon = pokedex[filDex[Math.floor(Math.random() * filDex.length)]]; 
        let hintdata = '8';
        let randPokeNum = mon.num;
        if (randPokeNum >= 1 && randPokeNum <= 151) hintdata = '1';
        if (randPokeNum >= 152 && randPokeNum <= 251) hintdata = '2';
        if (randPokeNum >= 252 && randPokeNum <= 386) hintdata = '3';
        if (randPokeNum >= 387 && randPokeNum <= 493) hintdata = '4';
        if (randPokeNum >= 494 && randPokeNum <= 649) hintdata = '5';
        if (randPokeNum >= 650 && randPokeNum <= 721) hintdata = '6';
        if (randPokeNum >= 722 && randPokeNum <= 809) hintdata = '7';
        if (randPokeNum < 0) hintdata = 'CAP';
        if (hint === 'Colour: ') hintdata = mon.color;
        else if (hint === 'Type(s): ') hintdata = mon.types.join(' / ');
        else if (hint === 'BST: ') hintdata = mon.baseStats.hp + mon.baseStats.atk + mon.baseStats.def + mon.baseStats.spa + mon.baseStats.spd + mon.baseStats.spe;
        else if (hint === 'Egg group(s): ') hintdata = mon.eggGroups.join(' and ');
        else if (['HP: ', 'Atk: ', 'Def: ', 'SpA: ', 'SpD: ', 'Spe: '].includes(hint)) {
            if (hint === 'HP: ') hintdata = mon.baseStats.hp;
            else if (hint === 'Atk: ') hintdata = mon.baseStats.atk;
            else if (hint === 'Def: ') hintdata = mon.baseStats.def;
            else if (hint === 'SpA: ') hintdata = mon.baseStats.spa;
            else if (hint === 'SpD: ') hintdata = mon.baseStats.spd;
            else if (hint === 'Spe: ') hintdata = mon.baseStats.spe;
            else return Bot.say(room, 'Error occurred.');
        }
        else if (hint === 'A Pokemon!') hintdata = '';
        Bot.say(room, '/hangman create ' + mon.name + ', ' + hint + hintdata);
    }
}