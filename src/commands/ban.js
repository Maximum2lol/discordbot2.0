module.exports = {
  name: 'ban',
  description: 'Bans a member from the server',
  execute(message, args) {
if (!message.member.permissions.has('BAN_MEMBERS')) {
  return message.reply('You do not have permissions to use this command!');
}

if (args.length < 3) {
  return message.reply('Please provide a user, a reason, and a duration to ban!');
}

const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

if (!member) {
  return message.reply('Invalid user provided!');
}

if (!member.bannable) {
  return message.reply('I cannot ban this user!');
}

const durationRegex = /(\d+)\s*(minutes?|mins?|hours?|hrs?|days?)/i;
const durationMatch = args[args.length - 1].match(durationRegex);

if (!durationMatch) {
  return message.reply('Please provide a valid ban duration in minutes, hours, or days!');
}

const durationAmount = parseInt(durationMatch[1]);
const durationUnit = durationMatch[2].toLowerCase();

let banDurationMs = null;

switch (durationUnit) {
  case 'minute':
  case 'minutes':
  case 'min':
    banDurationMs = durationAmount * 60 * 1000;
    break;

  case 'hour':
  case 'hours':
  case 'hr':
  case 'hrs':
    banDurationMs = durationAmount * 60 * 60 * 1000;
    break;

  case 'day':
  case 'days':
    banDurationMs = durationAmount * 24 * 60 * 60 * 1000;
    break;
}

if (!banDurationMs) {
  return message.reply('Please provide a valid ban duration in minutes, hours, or days!');
}

const reason = args.slice(1, args.length - 1).join(' ');

member.ban({ reason, days: 7 }).then(() => {
  message.reply(`${member.user.tag} was banned from the server for "${reason}"!`);

  setTimeout(() => {
    message.guild.members.unban(member).catch(error => {
      console.error(error);
      message.reply('An error occurred while trying to unban the user!');
    });
  }, banDurationMs);
}).catch(error => {
  console.error(error);
  message.reply('An error occurred while trying to ban the user!');
});
}

}