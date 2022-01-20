const Discord = require("discord.js");
const { MessageButton, MessageActionRow } = require("discord-buttons");
const config = require("../config")


exports.run = (client, message, args) => {
  let totalSeconds = client.uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

  let button = new MessageButton()
    .setLabel("Support Server")
    .setStyle("url")
    .setURL(config.inviteSupport);
  let button1 = new MessageButton()
    .setLabel("Invite Bot")
    .setStyle("url")
    .setURL(
      config.inviteLink
    );
  let row = new MessageActionRow().addComponent(button).addComponent(button1);
  let helpEmbed = new Discord.MessageEmbed()
    .setColor("E5BE11")
    .setTitle("PteroControl | Information")
    .setThumbnail(client.user.avatarURL())
    .setDescription(
      `**Ping** : ${client.ws.ping}ms\n**Uptime** : ${uptime}\n\nAuthor:\n\`Hirzi#8701\`\n\`AcktarDevs#6724\``
    )
    .setFooter(`(C) 2021 PteroControl Client | For Pterodactyl V1.x`);
  message.channel.send({ embed: helpEmbed, component: row });
};
