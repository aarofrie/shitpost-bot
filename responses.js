const emojis = require('./emojis');
const users = require('./users');

function aaronGif(msg) {
  // let's keep this bad boy around for a bit 
  // msg.channel.send('https://giphy.com/gifs/man-pepsi-9kDr8Zm8dOuyc');
  msg.channel.send('https://giphy.com/gifs/soda-funny-hot-G1zGMZtfmKjEQ');
  msg.channel.send(`<@${users.aaron}> irl`);
}

function reactWave(msg) {
  msg.react(emojis.wave7)
    .then(() => msg.react(emojis.wave6))
    .then(() => msg.react(emojis.wave5))
    .then(() => msg.react(emojis.wave4))
    .then(() => msg.react(emojis.wave3))
    .then(() => msg.react(emojis.wave2))
    .then(() => msg.react(emojis.wave1));
}

function wordReaction(msg, word) {
  let initialPromise = msg.react(emojiLetter(word[0]));

  for(let i = 1; i < word.length; i++)
    initialPromise = initialPromise.then(() => msg.react(emojiLetter(word[i])));
}

function emojiLetter(letter) {
  return emojis.letters[letter.toLowerCase()];
}

function spongebob(msg) {
  let reply = '';
  for(let i = 0; i < msg.content.length; i++)
    reply += i % 2 === 1
      ? msg.content[i].toUpperCase()
      : msg.content[i].toLowerCase();
  msg.channel.send(reply);
}

String.prototype.strip = function() {
  return this.toLowerCase().replace(/[\s']/g, "");
}

module.exports = [
  {
    name: 'react to zack with zackMoji',
    trigger: (msg, rnd) => msg.author.id === users.zack && rnd <= 0.2,
    effect: (msg) => msg.react(emojis.zack)
  },
  {
    name: '@zack',
    trigger: (msg, rnd) => msg.content.includes(`@<${emojis.zack}>`),
    effect: (msg) => msg.channel.send(`<@${users.zack}>`)
  },
  {
    name: '@bacon',
    trigger: (msg, rnd) => msg.content.includes(`@🥓`),
    effect: (msg) => msg.channel.send(`<@${users.bacon}>`)
  },
  {
    name: 'rizo parrot wave',
    trigger: (msg, rnd) => msg.author.id === users.rizo && rnd < 0.05,
    effect: reactWave
  },
  {
    name: 'rizo party',
    trigger: (msg, rnd) => msg.author.id === users.rizo && rnd >= 0.05 && rnd < 0.15,
    effect: (msg) => msg.react(emojis.partyParrot)
  },
  {
    name: 'rizo partyfast',
    trigger: (msg, rnd) => msg.author.id === users.rizo && rnd >= 0.15 && rnd <= 0.2,
    effect: (msg) => msg.react(emojis.fastParrot)
  },
  {
    name: 'rizo pls',
    trigger: (msg, rnd) => msg.content.includes(`<@${users.rizo}>`),
    effect: (msg) => wordReaction(msg, "rizopls")
  },
  {
    name: 'lets go party',
    trigger: (msg, rnd) => (msg.content.strip().includes('letsgo') || msg.content.strip().includes('ketsgi')) && rnd < 0.5,
    effect: (msg) => msg.react(emojis.partyParrot)
  },
  {
    name: 'lets go letters',
    trigger: (msg, rnd) => (msg.content.strip().includes('letsgo') || msg.content.strip().includes('ketsgi')) && rnd >= 0.5,
    effect: (msg) => wordReaction(msg, "letsgo")
  },
  {
    name: 'namelessGing',
    trigger: (msg, rnd) => msg.author.id === users.jerran && rnd <= 0.2,
    effect: (msg) => msg.react(emojis.wendyParrot)
  },
  {
    name: 'aaron gif reply',
    trigger: (msg, rnd) => msg.author.id === users.aaron && rnd <= 0.01,
    effect: aaronGif 
  },
  {
    name: 'aaron bepsi reply',
    trigger: (msg, rnd) => msg.author.id === users.aaron && rnd <= 0.15,
    effect: (msg) => msg.react(emojis.bepsi)
  },
  {
    name: 'make [thing] great again',
    trigger: (msg, rnd) => msg.content.toLowerCase().match(/.*ma[kd]e.*great again.*/),
    effect: (msg) => msg.react(emojis.maga)
  },
  {
    name: 'maga -> trumpgasm',
    trigger: (msg, rnd) => msg.content.includes(':maga:'),
    effect: (msg) => msg.react(emojis.trumpgasm)
  },
  {
    name: 'siiick',
    trigger: (msg, rnd) => msg.content === "🤢",
    effect: (msg) => wordReaction(msg, "sick")
  },
  {
    name: 'spongebob',
    trigger: (msg, rnd) => (msg.author.id === users.jerran || msg.author.id === users.zack) && rnd <= 0.05,
    effect: (msg) => spongebob(msg)
  }
];