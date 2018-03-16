const Discord = require('discord.js');
const config = require('./config');
const responses = require('./responses');

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
    
    //don't reply to self
    if (msg.author.id === '403968219276378123')
      return;

    responses
      .filter(r => r.trigger(msg, Math.random()))
      .forEach(r => r.effect(msg));
  }
}

module.exports = runBot;
