const { MessageEmbed } = require("discord.js");
const { MessageButton } = require("discord-buttons");
const config = require("../config")


exports.run = (client, message, args) => {
  let embed = new MessageEmbed()
    .setDescription("You can invite this bot by pressing the invite button")
    .setColor("E5BE11")
    .setTitle("PteroControl | Information")
    .setThumbnail(client.user.avatarURL())
    .setFooter(`PteroControl For Pterodactyl V1.x`);

  let button = new MessageButton()
    .setLabel("Invite")
    .setStyle("url")
    .setURL(
      config.inviteLink
    );

  message.channel.send({ embed: embed, component: button });
};
