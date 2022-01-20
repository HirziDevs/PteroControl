let prefix = require("../models/prefix.js");

module.exports = (client, message) => {
  let deprefix = "-";

  if (message.channel.type !== "dm") {
    prefix
      .find({
        GUILDID: message.guild.id,
      })
      .then((guildprefix) => {
        if (guildprefix.length === 0) {
          if (message.author.bot) return;
          if (message.content.indexOf(deprefix) !== 0) return;

          const args = message.content.slice(1).trim().split(/ +/g);
          const command = args.shift().toLowerCase();
          const cmd = client.commands.get(command);

          if (!cmd) return;
          cmd.run(client, message, args);
        }
        if (guildprefix.length > 0) {
          deprefix = guildprefix[0].PREFIX;

          if (message.author.bot) return;
          if (message.content.indexOf(deprefix) !== 0) return;

          const args = message.content.slice(1).trim().split(/ +/g);
          const command = args.shift().toLowerCase();
          const cmd = client.commands.get(command);

          if (!cmd) return;
          cmd.run(client, message, args);
        }
      });
  } else {
    if (message.author.bot) return;
    if (message.content.indexOf(deprefix) !== 0) return;

    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);

    if (!cmd) return;
    cmd.run(client, message, args);
  }
};
