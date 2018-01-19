const Discord = require('discord.js');
const config = require('./config');

// wait five minutes and try again .. The most common crash is discord losing connection,
// and trying again immediately would fail as well.
const retryIn = 5 * 60 * 1000; //

const maxCrashes = 5;
let crashes = 0; // if only it were that easy...

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

  bot.once('ready', onReady);
  bot.on('message', onMessage);
  bot.on('disconnect', onDisconnect);

  function onDisconnect() {
    process.exitCode = 0;
  }

  function onReady() {
    bot.commands = new Map();
    // bot.commands.set('help', new commands.HelpCommand(bot));

    console.log(`Setup Complete. Active in ${bot.guilds.size} servers.`);
  }

  function onMessage(msg) {
    if (msg.content === config.discord.authToken) {
      console.log(`Emergency shut-off requested by ${msg.author.username}#${msg.author.discriminator} id ${msg.author.id}`);
      // exit instead of set exitCode because this needs to be shut off immediately
      process.exit(503);
    }

    if (msg.author.bot)
      return;

    if (msg.content.trim().startsWith(prefix))
      offset = prefix.length;
    else if (msg.content.trim().startsWith(bot.user.toString()))
      offset = bot.user.toString().length + 1;
    else // if message doesn't start with the prefix or an @mention, just ignore their message.
      return;

    const userInput = msg.content.substring(offset).split(' ')[0].toLowerCase();
    const command = bot.commands.get(userInput);

    if (!command)
      return;

    const args = msg.content.substring(offset + userInput.length).trim();
    command.run(msg, args);
  }
}

module.exports = runBot;