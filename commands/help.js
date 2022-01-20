exports.run = (client, message, args) => {

  const Discord = require("discord.js");

  const prefix = require('../models/prefix.js')

  let gprefix = '-'

  if (message.channel.type !== 'dm') {
    prefix.find({
      GUILDID: message.guild.id
    }).then((guildprefix) => {
      if (guildprefix.length === 0) {
        //if the guild don't have custom prefix
        let helpEmbed = new Discord.MessageEmbed()
          .setColor("E5BE11")
          .setTitle("PteroControl | Help Menu")
          .setThumbnail(client.user.avatarURL())
          .addField(gprefix + "control", "```Main command for Panel and Server Management```")
          .addField(gprefix + "info", "```Check bot information and credit```")
          .addField(gprefix + "invite", "```Invite this bot to your server```")
          .addField(gprefix + "tutorial", "```A tutorial on how to use this bot```")
          .setFooter(`(C) 2021 PteroControl Client | For Pterodactyl V1.x`)
        message.channel.send(helpEmbed);

      }
      if (guildprefix.length > 0) {
        gprefix = guildprefix[0].PREFIX
        let helpEmbed = new Discord.MessageEmbed()
          .setColor("E5BE11")
          .setTitle("PteroControl | Help Menu")
          .setThumbnail(client.user.avatarURL())
          .addField(gprefix + "control", "```Main command for Panel and Server Management```")
          .addField(gprefix + "info", "```Check bot information and credit```")
          .addField(gprefix + "invite", "```Invite this bot to your server```")
          .addField(gprefix + "tutorial", "```A tutorial on how to use this bot```")
          .setFooter(`(C) 2021 PteroControl Client | For Pterodactyl V1.x`)
        message.channel.send(helpEmbed);

      }
    })
  }
  else {
    let helpEmbed = new Discord.MessageEmbed()
      .setColor("E5BE11")
      .setTitle("PteroControl | Help Menu")
      .setThumbnail(client.user.avatarURL())
      .addField(gprefix + "control", "```Main command for Panel and Server Management```")
      .addField(gprefix + "info", "```Check bot information and credit```")
      .addField(gprefix + "invite", "```Invite this bot to your server```")
      .addField(gprefix + "tutorial", "```A tutorial on how to use this bot```")
      .setFooter(`(C) 2021 PteroControl Client | For Pterodactyl V1.x`)
    message.channel.send(helpEmbed);

  }
}