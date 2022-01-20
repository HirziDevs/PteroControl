const { MessageEmbed } = require("discord.js");
const prefix = require("../models/prefix.js");

exports.run = (client, message, args) => {
  let title = "PteroControl | Guild Settings";
  let footer = "PteroControl For Pterodactyl 1.x";
  let color = "E5BE11";
  let thumbnail = client.user.avatarURL();

  const NoArgs = new MessageEmbed()
    .setTitle(title)
    .setFooter(footer)
    .setThumbnail(thumbnail)
    .setColor(color)
    .setDescription("Command Usage `-setprefix <guild prefix>`");

  const NoPerm = new MessageEmbed()
    .setTitle(title)
    .setFooter(footer)
    .setThumbnail(thumbnail)
    .setColor(color)
    .setDescription("You need `Manage Server` permission to use this command");

  const Success = new MessageEmbed()
    .setTitle(title)
    .setFooter(footer)
    .setThumbnail(thumbnail)
    .setColor(color)
    .setDescription("Successfuly changed prefix for this server");

  const errorDB = new MessageEmbed()
    .setDescription(
      "We are currently experiencing some downtime with our database provider. It is expected to be resolved within the next 30 minutes. Sorry for any inconvenience caused!"
    )
    .setTitle(title)
    .setFooter(footer)
    .setColor(color)
    .setThumbnail(thumbnail);

  if (!message.member.hasPermission("MANAGE_GUiLD"))
    return message.channel.send(NoPerm);
  if (!args[0]) return message.channel.send(NoArgs);

  try {
    const newprefix = new prefix({
      GUILDID: message.guild.id,
      PREFIX: args[0],
    });

    newprefix.save();
    message.channel.send(Success);
  } catch (error) {
    message.channel.send(errorDB);
  }
};
