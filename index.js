const Discord = require('discord.js');
const config = require('./config');

// wait five minutes and try again .. The most common crash is discord losing connection,
// and trying again immediately would fail as well.
const retryIn = 5 * 60 * 1000; //

const maxCrashes = 5;
let crashes = 0; // if only it were that easy...

runBot();

function runBot() {
  try {
    console.log(`Initializing for attempt number ${crashes} ...`);
    init();
  } catch (error) {
    crashes += 1;
    console.log(`Encountered error # ${crashes}:`);
    console.log(error);

    if (crashes < maxCrashes) {
      console.log(`Retrying in ${retryIn / 1000 / 60} minutes.`);
      setTimeout(runBot, retryIn);
    } else
      process.exit(500); // just let it die
  }
}

function init() {
  const bot = new Discord.Client();
  const token = config.discord.authToken;

  const baconId = '108352053692125184';
  const zackId =  '108568431053246464';
  const zackMoji = ':zack:401543766084943892';
  const rizoId = '100758264047747072'
  const parrotMoji = 'a:ultrafastparrot:397874139848769557';
  const jerranId = '189006310501646336';
  const aaronId = '65055432095301632';

  bot.login(token);

  bot.on('message', onMessage);
  bot.on('disconnect', onDisconnect);

  function onDisconnect() {
    process.exitCode = 0;
  }

  function onMessage(msg) {
    if (msg.content === config.discord.authToken) {
      console.log(`Emergency shut-off requested by ${msg.author.username}#${msg.author.discriminator} id ${msg.author.id}`);
      // exit instead of set exitCode because this needs to be shut off immediately
      process.exit(503);
    }

    if (msg.author.bot)
      return;

    const rnd = Math.random();

    // only give him a 1/4 chance
    if (msg.author.id === zackId && rnd <= 0.25) {
      msg.react(zackMoji);
    }
    if (msg.content.includes(`@<:zack:401543766084943892>`)) {
      msg.channel.send(`<@${zackId}>`);
    }
    if(msg.author.id === rizoId) {
      if(rnd < 0.05)
        msg.react('a:parrotwave7:397874137529319425')
          .then(() => msg.react('a:parrotwave6:397874138959839233')) 
          .then(() => msg.react('a:parrotwave5:397874134929113088')) 
          .then(() => msg.react('a:parrotwave4:397874133523890178'))
          .then(() => msg.react('a:parrotwave3:397874131539853322'))
          .then(() => msg.react('a:parrotwave2:397874132664188930'))
          .then(() => msg.react('a:parrotwave1:397874130185093131'));
      else if (rnd >= 0.05 && rnd <= 0.15)
        msg.react('a:partyparrot:397874122232954901');
      else if (rnd >= 0.15 && rnd <= 0.2)
        msg.react('a:ultrafastparrot:397874139848769557');
    }
    if(msg.content.includes('<@100758264047747072>') ) {
        msg.react('🇷')
          .then(() => msg.react('🇮'))
          .then(() => msg.react('🇿'))
          .then(() => msg.react('🇴'))
          .then(() => msg.react('🇵'))
          .then(() => msg.react('🇱'))
          .then(() => msg.react('🇸'));
    }
    if(msg.content.strip().includes('letsgo') || msg.content.strip().includes('ketsgi')) {
      msg.react('a:partyparrot:397874122232954901');
    }
    if(msg.author.id === jerranId && rnd <= 0.3) {
      msg.react('a:wendyparrot:399242434300870658');
    }
    if(msg.author.id === aaronId) {
      if(rnd <= 0.05) {
        msg.channel.send('https://giphy.com/gifs/man-pepsi-9kDr8Zm8dOuyc');
        msg.channel.send(`<@${aaronId}> irl`);
      } else if (rnd <= 0.3)
        msg.react(':bepsi:410166385918869504');
    }
  }
}

String.prototype.strip = function() {
  return ("" + this).toLowerCase().replace(/[\s']/g, "");
}

module.exports = runBot;
