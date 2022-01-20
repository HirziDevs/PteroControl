const { MessageEmbed } = require("discord.js");
const { createSimpleSlider } = require("discord-epagination");

const prefix = require("../models/prefix.js");

exports.run = (client, message, args) => {
  let gprefix = "-";

  if (message.channel.type !== "dm") {
    prefix
      .find({
        GUILDID: message.guild.id,
      })
      .then((guildprefix) => {
        if (guildprefix.length === 0) {
          //if the guild don't have custom prefix
          let embed0 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 1")
            .setColor("E5BE11")
            .setDescription(
              "Go to your Hosting Panel and copy the Panel URL/LINK"
            )
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870935938413494302/Screenshot_2021-07-31-14-14-00-45.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed1 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 2")
            .setColor("E5BE11")
            .setDescription("Go to Profile button on the top right")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870929432846671932/20210731_142210.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed2 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 3")
            .setColor("E5BE11")
            .setDescription("Go to API Credentials button on the top left")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870929432595009576/20210731_142103.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed3 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 4")
            .setColor("E5BE11")
            .setDescription(
              "Fill the description anything you want and press create, you don't need to fill Allowed Ips"
            )
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870929432095911946/20210731_142012.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed4 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 5")
            .setColor("E5BE11")
            .setDescription(
              "Copy the Panel ApiKey that just appear on your screen"
            )
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870929431848435762/20210731_141910.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed5 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 6")
            .setColor("E5BE11")
            .setDescription(
              "Type `" +
                gprefix +
                "control`, select register button or register new panel menu, and check your dms"
            )
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870929906182258728/20210731_142350.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed6 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 7")
            .setColor("E5BE11")
            .setDescription("Type your Panel URL/LINK")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870931067849302066/IMG_20210731_142808.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed7 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 8")
            .setColor("E5BE11")
            .setDescription("Paste your Panel ApiKey")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870931068084191272/IMG_20210731_142820.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed8 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 9")
            .setColor("E5BE11")
            .setDescription("Type the Panel name")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870931068407136296/IMG_20210731_142835.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed9 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 10")
            .setColor("E5BE11")
            .setDescription(
              "Type `" +
                gprefix +
                "control` again and select your server the the button name"
            )
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870931249169055795/Screenshot_2021-07-31-14-29-47-46_572064f74bd5f9fa804b05334aa4f912.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed10 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial End")
            .setColor("E5BE11")
            .setDescription("Thank you for using PteroControl, have fun!")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870932824046338089/20210731_143542.jpg"
            )
            .setFooter("Press '>>' Button to go back to first Step");

          createSimpleSlider(
            message,
            [
              embed0,
              embed1,
              embed2,
              embed3,
              embed4,
              embed5,
              embed6,
              embed7,
              embed8,
              embed9,
              embed10,
            ],
            ["⬅️", "➡️"],
            120000
          );
        }
        if (guildprefix.length > 0) {
          gprefix = guildprefix[0].PREFIX;
          //if the guild have custom prefix
          let embed0 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 1")
            .setColor("E5BE11")
            .setDescription(
              "Go to your Hosting Panel and copy the Panel URL/LINK"
            )
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870935938413494302/Screenshot_2021-07-31-14-14-00-45.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed1 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 2")
            .setColor("E5BE11")
            .setDescription("Go to Profile button on the top right")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870929432846671932/20210731_142210.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed2 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 3")
            .setColor("E5BE11")
            .setDescription("Go to API Credentials button on the top left")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870929432595009576/20210731_142103.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed3 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 4")
            .setColor("E5BE11")
            .setDescription(
              "Fill the description anything you want and press create, you don't need to fill Allowed Ips"
            )
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870929432095911946/20210731_142012.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed4 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 5")
            .setColor("E5BE11")
            .setDescription(
              "Copy the Panel ApiKey that just appear on your screen"
            )
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870929431848435762/20210731_141910.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed5 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 6")
            .setColor("E5BE11")
            .setDescription(
              "Type `" +
                gprefix +
                "control`, select register button or register new panel menu, and check your dms"
            )
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870929906182258728/20210731_142350.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed6 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 7")
            .setColor("E5BE11")
            .setDescription("Type your Panel URL/LINK")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870931067849302066/IMG_20210731_142808.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed7 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 8")
            .setColor("E5BE11")
            .setDescription("Paste your Panel ApiKey")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870931068084191272/IMG_20210731_142820.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed8 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 9")
            .setColor("E5BE11")
            .setDescription("Type the Panel name")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870931068407136296/IMG_20210731_142835.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed9 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial Step 10")
            .setColor("E5BE11")
            .setDescription(
              "Type `" +
                gprefix +
                "control` again and select your server the the button name"
            )
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870931249169055795/Screenshot_2021-07-31-14-29-47-46_572064f74bd5f9fa804b05334aa4f912.jpg"
            )
            .setFooter("Press '>>' Button to continue to Next Step");

          let embed10 = new MessageEmbed()
            .setTitle("PteroControl | Tutorial End")
            .setColor("E5BE11")
            .setDescription("Thank you for using PteroControl, have fun!")
            .setImage(
              "https://media.discordapp.net/attachments/796243715014131714/870932824046338089/20210731_143542.jpg"
            )
            .setFooter("Press '>>' Button to go back to first Step");

          createSimpleSlider(
            message,
            [
              embed0,
              embed1,
              embed2,
              embed3,
              embed4,
              embed5,
              embed6,
              embed7,
              embed8,
              embed9,
              embed10,
            ],
            ["⬅️", "➡️"],
            120000
          );
        }
      });
  } else {
    //DMS
    let embed0 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial Step 1")
      .setColor("E5BE11")
      .setDescription("Go to your Hosting Panel and copy the Panel URL/LINK")
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870935938413494302/Screenshot_2021-07-31-14-14-00-45.jpg"
      )
      .setFooter("Press '>>' Button to continue to Next Step");

    let embed1 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial Step 2")
      .setColor("E5BE11")
      .setDescription("Go to Profile button on the top right")
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870929432846671932/20210731_142210.jpg"
      )
      .setFooter("Press '>>' Button to continue to Next Step");

    let embed2 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial Step 3")
      .setColor("E5BE11")
      .setDescription("Go to API Credentials button on the top left")
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870929432595009576/20210731_142103.jpg"
      )
      .setFooter("Press '>>' Button to continue to Next Step");

    let embed3 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial Step 4")
      .setColor("E5BE11")
      .setDescription(
        "Fill the description anything you want and press create, you don't need to fill Allowed Ips"
      )
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870929432095911946/20210731_142012.jpg"
      )
      .setFooter("Press '>>' Button to continue to Next Step");

    let embed4 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial Step 5")
      .setColor("E5BE11")
      .setDescription("Copy the Panel ApiKey that just appear on your screen")
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870929431848435762/20210731_141910.jpg"
      )
      .setFooter("Press '>>' Button to continue to Next Step");

    let embed5 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial Step 6")
      .setColor("E5BE11")
      .setDescription(
        "Type `" +
          gprefix +
          "control`, select register button or register new panel menu, and check your dms"
      )
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870929906182258728/20210731_142350.jpg"
      )
      .setFooter("Press '>>' Button to continue to Next Step");

    let embed6 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial Step 7")
      .setColor("E5BE11")
      .setDescription("Type your Panel URL/LINK")
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870931067849302066/IMG_20210731_142808.jpg"
      )
      .setFooter("Press '>>' Button to continue to Next Step");

    let embed7 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial Step 8")
      .setColor("E5BE11")
      .setDescription("Paste your Panel ApiKey")
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870931068084191272/IMG_20210731_142820.jpg"
      )
      .setFooter("Press '>>' Button to continue to Next Step");

    let embed8 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial Step 9")
      .setColor("E5BE11")
      .setDescription("Type the Panel name")
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870931068407136296/IMG_20210731_142835.jpg"
      )
      .setFooter("Press '>>' Button to continue to Next Step");

    let embed9 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial Step 10")
      .setColor("E5BE11")
      .setDescription(
        "Type `" +
          gprefix +
          "control` again and select your server the the button name"
      )
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870931249169055795/Screenshot_2021-07-31-14-29-47-46_572064f74bd5f9fa804b05334aa4f912.jpg"
      )
      .setFooter("Press '>>' Button to continue to Next Step");

    let embed10 = new MessageEmbed()
      .setTitle("PteroControl | Tutorial End")
      .setColor("E5BE11")
      .setDescription("Thank you for using PteroControl, have fun!")
      .setImage(
        "https://media.discordapp.net/attachments/796243715014131714/870932824046338089/20210731_143542.jpg"
      )
      .setFooter("Press '>>' Button to go back to first Step");

    createSimpleSlider(
      message,
      [
        embed0,
        embed1,
        embed2,
        embed3,
        embed4,
        embed5,
        embed6,
        embed7,
        embed8,
        embed9,
        embed10,
      ],
      ["⬅️", "➡️"],
      120000
    );
  }
};
