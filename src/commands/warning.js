module.exports = {
    name: 'warn',
    description: 'Sends a warning to the specified user.',
    execute(message, args) {
      const { member, mentions, guild } = message;
      const reason = args.slice(1).join(' ');
      const user = mentions.users.first();
      if (!user) {
        return message.reply('Please specify a valid user to warn.');
      }
      if (!reason) {
        return message.reply('Please provide a reason for the warning.');
      }
      const warningMessage = `You have been warned in ${guild.name} for "${reason}".`;
      user.send(warningMessage).catch(error => {
        console.error(`Could not send warning message to ${user.tag}.\n`, error);
        message.reply(`Could not send warning message to ${user.tag}.`);
      });
      message.reply(`Successfully warned ${user.tag} for "${reason}".`);
    }
  }
  