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

  const wave7 = 

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

    if (msg.author.id === zackId) {
      msg.react(zackMoji);
    }
    else if (msg.content.includes(`@<:zack:401543766084943892>`)) {
      msg.channel.send(`<@${zackId}>`);
    }
    else if(msg.author.id === rizoId) {
      // msg.react('a:parrotwave7:397874137529319425'); 
      // msg.react('a:parrotwave6:397874138959839233'); 
      // msg.react('a:parrotwave5:397874134929113088'); 
      // msg.react('a:parrotwave4:397874133523890178'); 
      // msg.react('a:parrotwave3:397874131539853322'); 
      // msg.react('a:parrotwave2:397874132664188930'); 
      // msg.react('a:parrotwave1:397874130185093131');

      msg.react(parrotMoji);
    }

      // if (msg.author.id === '108352053692125184') {
      //   msg.react(parrotMoji);
      // }
    
    //if msg.content like "lets go" || "kets gi"
    // react :parrotwave:
  }
}

module.exports = runBot;
