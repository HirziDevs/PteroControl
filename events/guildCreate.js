const Discord = require("discord.js");
const { MessageButton } = require("discord-buttons");
const config = require("../config");

module.exports = (client, guild) => {
  let embed = new Discord.MessageEmbed()
    .setAuthor("PteroControl | Information", client.user.avatarURL())
    .setColor("RANDOM")
    .setThumbnail(guild.iconURL())
    .setDescription(
      "Thank you for adding me to your discord server! to get all command information type `-help`, if you needing help join our support server by clicking the button!"
    );
  let button = new MessageButton()
    .setLabel("Support Server")
    .setStyle("url")
    .setURL(config.inviteSupport);
  guild.owner.user.send({ embed: embed, component: button });
};
