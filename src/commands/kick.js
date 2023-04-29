module.exports = {
    name: 'kick',
    description: 'Kicks a member from the server',
    execute(message, args) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('You do not have permissions to use this command!');
        }
      
        if (args.length < 2) {
            return message.reply('Please provide a user and a reason to kick!');
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.reply('Invalid user provided!');
        }

        if (!member.kickable) {
            return message.reply('I cannot kick this user!');
        }

        const reason = args.slice(1).join(' ');

        member.kick(reason).then(() => {
            message.reply(`${member.user.tag} was kicked from the server for "${reason}"!`);
        }).catch(error => {
            console.error(error);
            message.reply('An error occurred while trying to kick the user!');
        });
    },
};
