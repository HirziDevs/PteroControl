exports.run = (client, message, args) => {
  const { MessageEmbed } = require("discord.js");
  const {
    MessageButton,
    MessageActionRow,
    MessageMenu,
    MessageMenuOption,
  } = require("discord-buttons");
  const panel = require("../models/panel.js");
  const node = require("nodeactyl");
  const wait = require("util").promisify(setTimeout);
  const config = require("../config")
  let panelURL;
  let panelAPI;
  let panelNAME;

  let panelTitle = "PteroControl | Panel Management";
  let serverTitle = "PteroControl | Server Management";
  let accountTitle = "PteroControl | Account Management";
  let footer = "PteroControl For Pterodactyl 1.x";
  let color = "E5BE11";
  let thumbnail = client.user.avatarURL();
  const id = message.author.id;

  const Discord = new MessageButton()
    .setLabel("Support")
    .setStyle("url")
    .setURL(config.inviteSupport);

  const errorDB = new MessageEmbed()
    .setDescription(
      "We are currently experiencing some downtime with our database provider. It is expected to be resolved within the next 30 minutes. Sorry for any inconvenience caused!"
    )
    .setTitle(panelTitle)
    .setFooter(footer)
    .setColor(color)
    .setThumbnail(thumbnail);

  const close = new MessageButton()
    .setLabel("Close")
    .setStyle("red")
    .setID("close");

  const closeEmbed = new MessageEmbed()
    .setDescription("Proccess Cancelled")
    .setTitle(panelTitle)
    .setFooter(footer)
    .setColor(color)
    .setThumbnail(thumbnail);

  const loading = new MessageEmbed()
    .setTitle(panelTitle)
    .setFooter(footer)
    .setColor(color)
    .setThumbnail(thumbnail)
    .setDescription("Processing Requests");

  const embedExit = new MessageEmbed()
    .setTitle(panelTitle)
    .setFooter(footer)
    .setColor(color)
    .setThumbnail(thumbnail)
    .setDescription(
      "Panel with that name are already exist in your discord account, please use other name"
    );

  panel
    .find({
      ID: id,
    })
    .then((panels) => {
      const noPanel = new MessageEmbed()
        .setDescription(
          "You currently dont have a panel linked to our API. You can click register button to register one. All you need is the panel URL and a Client API Key!"
        )
        .setTitle(panelTitle)
        .setFooter(footer)
        .setColor(color)
        .setThumbnail(thumbnail);

      const register = new MessageButton()
        .setLabel("Register new panel")
        .setStyle("green")
        .setID("register");

      const registerRow = new MessageActionRow().addComponents(
        register,
        Discord
      );

      const reSucess = new MessageEmbed()
        .setColor(color)
        .setThumbnail(thumbnail)
        .setFooter(footer)
        .setDescription(
          "Your panel has been successfully registered on our api. You can now access it via the panel menu\n\n[Join our support server (Click Me)](https://discord.gg/9Z7zpdwATZ)"
        );

      const reEmbed = new MessageEmbed()
        .setColor(color)
        .setFooter(footer)
        .setImage(
          "https://cdn.glitch.com/b0cc99ff-cc1d-46a0-8146-a13e39873cd9%2F20210625_111805.jpg?v=1624612831266"
        );

      const reName = new MessageEmbed()
        .setFooter(footer)
        .setColor(color)
        .setDescription(
          "Now enter a name that will be used for multi panels **(Any value)**"
        );

      const reUrl = new MessageEmbed()
        .setFooter(footer)
        .setColor(color)
        .setDescription(
          "Please send your panel url. Example: **(https://panel.pterocontrol.com)**"
        );

      const reApi = new MessageEmbed()
        .setFooter(footer)
        .setColor(color)
        .setDescription(
          "Please send your client api key. Example: `h9eVJyejq3d97yQfuY55CxSWs73u9lC9gFfW0FutBR9hNfw`\n\nRemember to use `Client Api key` and not `Admin Api key`"
        );

      const reDm = new MessageEmbed()
        .setColor(color)
        .setTitle(panelTitle)
        .setThumbnail(thumbnail)
        .setFooter(footer)
        .setDescription(
          "For privacy precautions, the requested action will take place in your DMS. Please ensure that you are allowed to received DMS from this server"
        );

      if (panels.length < 1)
        message.channel
          .send({ embed: noPanel, component: registerRow })
          .then((remsg) => {
            const filter = (button) =>
              button.clicker.user.id === message.author.id;
            const Registercollector = remsg.createButtonCollector(filter, {
              max: 1,
              time: 30000,
            });

            Registercollector.on("collect", (b) => {
              if (b.id === "register") {
                remsg.edit({ embed: reDm, component: Discord });
                b.clicker.user.send({ embed: reEmbed }).then((m) => {
                  let c = m.channel;

                  c.send(reUrl).then(async function () {
                    await c
                      .awaitMessages((m) => m.author.id == message.author.id, {
                        max: 1,
                        time: 30000,
                      })
                      .then(async (collected) => {
                        console.log(collected.first());
                        panelURL = collected.first().content;
                      })
                      .then(async function () {
                        await c.send(reApi).then(async function () {
                          c.awaitMessages(
                            (m) => m.author.id == message.author.id,
                            { max: 1, time: 30000 }
                          )
                            .then(async (collected) => {
                              panelAPI = collected.first().content;
                            })
                            .then(async function () {
                              await c.send(reName).then(async function () {
                                c.awaitMessages(
                                  (m) => m.author.id == message.author.id,
                                  { max: 1, time: 30000 }
                                ).then(async (collected) => {
                                  panelNAME = collected.first().content;
                                  if (panelNAME.length > 100)
                                    return c.send(
                                      "Please keep the character limit to 25"
                                    );
                                  panel
                                    .find({
                                      ID: id,
                                      NAME: panelNAME.trim(),
                                    })
                                    .then((exit) => {
                                      if (exit.length > 0)
                                        return c.send(embedExit);
                                    })
                                    .catch((error) => {
                                      console.log(error);
                                      c.send({ embed: errorDB });
                                    });
                                  try {
                                    const npanel = new panel({
                                      ID: id,
                                      API: panelAPI.trim(),
                                      URL: panelURL.trim(),
                                      NAME: panelNAME.trim(),
                                    });
                                    await npanel.save();
                                    c.send({ embed: reSucess });
                                  } catch (error) {
                                    console.log(error);
                                    c.send({ embed: errorDB });
                                  }
                                });
                              });
                            });
                        });
                      });
                  });
                });
              }
            });
          });

      if (panels.length < 1) return;

      let panelist;
      let options = [];

      const reMenu = new MessageMenuOption()
        .setLabel("Register new panel")
        .setDescription("Select this to register new panel")
        .setValue("register");

      const closeMenu = new MessageMenuOption()
        .setLabel("Close")
        .setDescription("Select this to close menu")
        .setValue("close");

      options.push(reMenu);
      options.push(closeMenu);
      panels.forEach((data) => {
        let option = new MessageMenuOption()
          .setLabel(data.NAME)
          .setDescription("Select this to manage this panel")
          .setValue(data.NAME);

        options.push(option);

        if (!panelist) return (panelist = "**" + data.NAME + "**\n");
        panelist = panelist + "**" + data.NAME + "**\n";
      });

      const panelEmbed = new MessageEmbed()
        .setTitle(panelTitle)
        .setFooter(footer)
        .setThumbnail(thumbnail)
        .setColor(color)
        .setDescription("Please select a panel to manage\n" + panelist);

      const panelMenu = new MessageMenu().addOptions(options).setID("pmenu");

      message.channel
        .send({ embed: panelEmbed, component: panelMenu })
        .then((panelmsg) => {
          const filter = (button) =>
            button.clicker.user.id === message.author.id;
          const Panelcollector = panelmsg.createMenuCollector(filter, {
            max: 1,
            time: 30000,
          });
          Panelcollector.on("collect", async (m) => {
            if (m.values[0] === "close") {
              panelmsg
                .edit({ embed: closeEmbed, component: [] })
                .then((msg) => {
                  msg.delete({ timeout: 5000 });
                });
            }
            if (m.values[0] === "register") {
              panelmsg.edit({ embed: reDm, component: Discord });
              m.clicker.user.send({ embed: reEmbed }).then((m) => {
                let c = m.channel;

                c.send(reUrl).then(async function () {
                  await c
                    .awaitMessages((m) => m.author.id == message.author.id, {
                      max: 1,
                      time: 30000,
                    })
                    .then(async (collected) => {
                      panelURL = collected.first().content;
                    })
                    .then(async function () {
                      await c.send(reApi).then(async function () {
                        c.awaitMessages(
                          (m) => m.author.id == message.author.id,
                          { max: 1, time: 30000 }
                        )
                          .then(async (collected) => {
                            panelAPI = collected.first().content;
                          })
                          .then(async function () {
                            await c.send(reName).then(async function () {
                              c.awaitMessages(
                                (m) => m.author.id == message.author.id,
                                { max: 1, time: 30000 }
                              ).then(async (collected) => {
                                panelNAME = collected.first().content;
                                if (panelNAME.length > 100)
                                  return c.send(
                                    "Please keep the character limit to 25"
                                  );
                                panel
                                  .find({
                                    ID: id,
                                    NAME: panelNAME.trim(),
                                  })
                                  .then((exit) => {
                                    if (exit.length > 0)
                                      return c.send(embedExit);
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                    c.send({ embed: errorDB });
                                  });
                                try {
                                  const npanel = new panel({
                                    ID: id,
                                    API: panelAPI.trim(),
                                    URL: panelURL.trim(),
                                    NAME: panelNAME.trim(),
                                  });
                                  await npanel.save();
                                  c.send({ embed: reSucess });
                                } catch (error) {
                                  console.log(error);
                                  c.send({ embed: errorDB });
                                }
                              });
                            });
                          });
                      });
                    });
                });
              });
            } else {
              await panelmsg.edit({ embed: loading, component: [] });
              await wait(1500);
              panel
                .find({
                  ID: id,
                  NAME: m.values[0],
                })
                .then((fpanel) => {
                  const panelManage = new MessageEmbed()
                    .setTitle(panelTitle)
                    .setFooter(footer)
                    .setThumbnail(thumbnail)
                    .setColor(color)
                    .setDescription(
                      "Hey, what do you want to do with this " + m.values[0]
                    );

                  const pManage = new MessageButton()
                    .setLabel("Servers")
                    .setStyle("blurple")
                    .setID("pManage");

                  const pDelete = new MessageButton()
                    .setLabel("Delete")
                    .setStyle("red")
                    .setID("pDelete");

                  const pUrl = new MessageButton()
                    .setLabel("Panel Link")
                    .setStyle("blurple")
                    .setID("pUrl");

                  const pEdit = new MessageButton()
                    .setLabel("Edit")
                    .setStyle("blurple")
                    .setID("pEdit");

                  const pAcc = new MessageButton()
                    .setLabel("Account")
                    .setStyle("blurple")
                    .setID("pAcc");

                  const pManageRow = new MessageActionRow().addComponents(
                    pManage,
                    pEdit,
                    pUrl,
                    pAcc,
                    pDelete
                  );
                  const pCloseRow = new MessageActionRow().addComponent(close);

                  panelmsg.edit({
                    embed: panelManage,
                    components: [pManageRow, pCloseRow],
                  });

                  Panelcollector.stop();

                  const filter = (button) =>
                    button.clicker.user.id === message.author.id;
                  const panelManageCollector = panelmsg.createButtonCollector(
                    filter,
                    { max: 1, time: 30000 }
                  );

                  panelManageCollector.on("collect", async (pm) => {
                    if (pm.id === "close") {
                      panelmsg
                        .edit({ embed: closeEmbed, component: [] })
                        .then((msg) => {
                          msg.delete({ timeout: 5000 });
                        });
                    }
                    if (pm.id === "pAcc") {
                      await panelmsg.edit({ embed: loading, component: [] });
                      await wait(1500);
                      const Client = new node.NodeactylClient(
                        fpanel[0].URL,
                        fpanel[0].API
                      );

                      Client.getAccountDetails().then((acc) => {
                        let content;
                        let newcontent;

                        const currectPass = new MessageEmbed()
                          .setFooter(footer)
                          .setColor(color)
                          .setDescription(
                            "Please send your currect password on this panel"
                          );

                        const newEmail = new MessageEmbed()
                          .setFooter(footer)
                          .setColor(color)
                          .setDescription(
                            "Please send your new password for this panel"
                          );

                        const newPassword = new MessageEmbed()
                          .setFooter(footer)
                          .setColor(color)
                          .setDescription(
                            "Please send your new password for this panel"
                          );

                        const successAcc = new MessageEmbed()
                          .setFooter(footer)
                          .setColor(color)
                          .setDescription(
                            "Sended request to panel, if you didn't logged out from panel, that means your currect password is wrong, for future update this will send a error embed if you put wrong currect password"
                          );

                        const accEmbed = new MessageEmbed()
                          .setTitle(accountTitle)
                          .setFooter(footer)
                          .setColor(color)
                          .setThumbnail(thumbnail)
                          .setDescription(
                            "So you wanna manage your pterodactyl account?\n```\nUsername: " +
                              acc.username +
                              "\nID: " +
                              acc.id +
                              "\nAdmin: " +
                              acc.admin +
                              "\n```"
                          );

                        const updateEmail = new MessageButton()
                          .setLabel("Update Email")
                          .setStyle("blurple")
                          .setID("email");

                        const updatePass = new MessageButton()
                          .setLabel("Update Password")
                          .setStyle("blurple")
                          .setID("password");

                        const viewEmail = new MessageButton()
                          .setLabel("View Email")
                          .setStyle("blurple")
                          .setID("vemail");

                        const accRow = new MessageActionRow().addComponents(
                          updateEmail,
                          updatePass,
                          viewEmail,
                          close
                        );

                        panelmsg.edit({ embed: accEmbed, component: accRow });

                        const accountCollector = panelmsg.createButtonCollector(
                          filter,
                          { max: 1, time: 30000 }
                        );

                        accountCollector.on("collect", (ac) => {
                          if (ac.id === "email") {
                            panelmsg.edit({ embed: reDm, component: Discord });
                            m.clicker.user
                              .send({ embed: reEmbed })
                              .then((m) => {
                                let c = m.channel;

                                c.send(currectPass).then(async function () {
                                  await c
                                    .awaitMessages(
                                      (m) => m.author.id == message.author.id,
                                      { max: 1, time: 30000 }
                                    )
                                    .then(async (collected) => {
                                      content = collected.first().content;
                                    })
                                    .then(async function () {
                                      await c
                                        .send(newEmail)
                                        .then(async function () {
                                          c.awaitMessages(
                                            (m) =>
                                              m.author.id == message.author.id,
                                            { max: 1, time: 30000 }
                                          ).then(async (collected) => {
                                            newcontent =
                                              collected.first().content;

                                            Client.updateEmail(
                                              newcontent,
                                              content
                                            )
                                              .then((success) => {
                                                return c.send(successAcc);
                                              })
                                              .catch((error) => {
                                                console.log(error);
                                                return c.send(
                                                  "something happen"
                                                );
                                              });
                                          });
                                        });
                                    });
                                });
                              });
                          }
                          if (ac.id === "password") {
                            panelmsg.edit({ embed: reDm, component: Discord });
                            m.clicker.user
                              .send({ embed: reEmbed })
                              .then((m) => {
                                let c = m.channel;

                                c.send(currectPass).then(async function () {
                                  await c
                                    .awaitMessages(
                                      (m) => m.author.id == message.author.id,
                                      { max: 1, time: 30000 }
                                    )
                                    .then(async (collected) => {
                                      content = collected.first().content;
                                    })
                                    .then(async function () {
                                      await c
                                        .send(newPassword)
                                        .then(async function () {
                                          c.awaitMessages(
                                            (m) =>
                                              m.author.id == message.author.id,
                                            { max: 1, time: 30000 }
                                          ).then(async (collected) => {
                                            newcontent =
                                              collected.first().content;

                                            Client.updatePassword(
                                              newcontent,
                                              content
                                            )
                                              .then((success) => {
                                                console.log("test" + success);
                                                return c.send(successAcc);
                                              })
                                              .catch((error) => {
                                                console.log(error);
                                                return c.send(
                                                  "something happen"
                                                );
                                              });
                                          });
                                        });
                                    });
                                });
                              });
                          }
                          if (ac.id === "vemail") {
                            const emailEmbed = new MessageEmbed()
                              .setTitle(accountTitle)
                              .setFooter(footer)
                              .setColor(color)
                              .setThumbnail(thumbnail)
                              .setDescription(
                                "Your email from this pterodactyl panel is `" +
                                  acc.email +
                                  "`"
                              );

                            ac.reply.send({
                              embed: emailEmbed,
                              ephemeral: true,
                            });
                            panelmsg.delete();
                          }
                        });
                      });
                    }
                    if (pm.id === "pEdit") {
                      const embedEdit = new MessageEmbed()
                        .setTitle(panelTitle)
                        .setFooter(footer)
                        .setColor(color)
                        .setThumbnail(thumbnail)
                        .setDescription(
                          "Please select which one you want to edit"
                        );

                      const updated = new MessageEmbed()
                        .setTitle(panelTitle)
                        .setFooter(footer)
                        .setColor(color)
                        .setThumbnail(thumbnail)
                        .setDescription(fpanel[0].NAME + " updated!");

                      const editName = new MessageButton()
                        .setLabel("Name")
                        .setStyle("blurple")
                        .setID("ename");

                      const editUrl = new MessageButton()
                        .setLabel("Url/Link")
                        .setStyle("blurple")
                        .setID("eurl");

                      const editApi = new MessageButton()
                        .setLabel("Apikey")
                        .setStyle("blurple")
                        .setID("ekey");

                      const editRows = new MessageActionRow().addComponents(
                        editName,
                        editUrl,
                        editApi
                      );

                      panelmsg.edit({ embed: embedEdit, component: editRows });

                      const filter = (button) =>
                        button.clicker.user.id === message.author.id;
                      const EditManageCollector =
                        panelmsg.createButtonCollector(filter, {
                          max: 1,
                          time: 30000,
                        });

                      EditManageCollector.on("collect", async (ep) => {
                        if (ep.id === "ename") {
                          const editm = new MessageEmbed()
                            .setTitle(panelTitle)
                            .setFooter(footer)
                            .setColor(color)
                            .setThumbnail(thumbnail)
                            .setDescription(
                              "Please send what the new name for this panel"
                            );

                          panelmsg.edit({ embed: editm, component: [] });

                          await message.channel
                            .awaitMessages(
                              (m) => m.author.id == message.author.id,
                              { max: 1, time: 30000 }
                            )
                            .then(async (collected) => {
                              let newcontent = collected.first().content.trim();

                              panel
                                .find({
                                  ID: id,
                                  NAME: newcontent,
                                })
                                .then((exit) => {
                                  if (exit.length > 0)
                                    return panelmsg.edit(embedExit);
                                  collected.first().delete();
                                })
                                .catch((error) => {
                                  console.log(error);
                                  panelmsg.edit({ embed: errorDB });
                                  collected.first().delete();
                                });

                              panel
                                .findOneAndUpdate(
                                  {
                                    ID: id,
                                    NAME: m.values[0],
                                  },
                                  {
                                    NAME: newcontent,
                                  }
                                )
                                .then(() => {
                                  panelmsg.edit({
                                    embed: updated,
                                    component: [],
                                  });
                                })
                                .catch((Error) => {
                                  console.log(Error);
                                  panelmsg.edit({
                                    embed: errorDB,
                                    component: [],
                                  });
                                });
                            })
                            .catch((error) => {
                              message.channel.send("no answer");
                            });
                        }
                        if (ep.id === "eurl") {
                          const editm = new MessageEmbed()
                            .setTitle(panelTitle)
                            .setFooter(footer)
                            .setColor(color)
                            .setThumbnail(thumbnail)
                            .setDescription(
                              "Please send what the new url for this panel"
                            );

                          panelmsg.edit({ embed: editm, component: [] });

                          await message.channel
                            .awaitMessages(
                              (m) => m.author.id == message.author.id,
                              { max: 1, time: 30000 }
                            )
                            .then(async (collected) => {
                              let newcontent = collected.first().content.trim();

                              panel
                                .findOneAndUpdate(
                                  {
                                    ID: id,
                                    NAME: m.values[0],
                                  },
                                  {
                                    URL: newcontent,
                                  }
                                )
                                .then(() => {
                                  panelmsg.edit({
                                    embed: updated,
                                    component: [],
                                  });
                                  collected.first().delete();
                                })
                                .catch((Error) => {
                                  panelmsg.edit({
                                    embed: errorDB,
                                    component: [],
                                  });
                                  collected.first().delete();
                                });
                            })
                            .catch((error) => {
                              message.channel.send("no answer");
                            });
                        }
                        if (ep.id === "eapi") {
                          const editm = new MessageEmbed()
                            .setTitle(panelTitle)
                            .setFooter(footer)
                            .setColor(color)
                            .setThumbnail(thumbnail)
                            .setDescription(
                              "Please send what the new api for this panel"
                            );

                          panelmsg.edit({ embed: editm, component: [] });

                          await message.channel
                            .awaitMessages(
                              (m) => m.author.id == message.author.id,
                              { max: 1, time: 30000 }
                            )
                            .then(async (collected) => {
                              let newcontent = collected.first().content.trim();

                              panel
                                .findOneAndUpdate(
                                  {
                                    ID: id,
                                    NAME: m.values[0],
                                  },
                                  {
                                    API: newcontent,
                                  }
                                )
                                .then(() => {
                                  panelmsg.edit({
                                    embed: updated,
                                    component: [],
                                  });
                                  collected.first().delete();
                                })
                                .catch((Error) => {
                                  panelmsg.edit({
                                    embed: errorDB,
                                    component: [],
                                  });
                                  collected.first().delete();
                                });
                            })
                            .catch((error) => {
                              message.channel.send("no answer");
                            });
                        }
                      });
                    }
                    if (pm.id === "pUrl") {
                      const embedUrl = new MessageEmbed()
                        .setTitle(panelTitle)
                        .setFooter(footer)
                        .setColor(color)
                        .setThumbnail(thumbnail)
                        .setDescription("Your panel url is " + fpanel[0].URL);

                      panelmsg.delete();
                      pm.reply.send({ embed: embedUrl, ephemeral: true });
                    }
                    if (pm.id === "pDelete") {
                      const pDelEmbed = new MessageEmbed()
                        .setTitle(panelTitle)
                        .setFooter(footer)
                        .setThumbnail(thumbnail)
                        .setColor(color)
                        .setDescription(
                          "Panel succesfully deleted from our databases"
                        );

                      panel
                        .deleteOne({
                          ID: id,
                          NAME: m.values[0],
                        })
                        .then((res) => {
                          panelmsg
                            .edit({ embed: pDelEmbed, component: [] })
                            .then((msg) => {
                              msg.delete({ timeout: 5000 });
                            });
                        })
                        .catch((error) => {
                          panelmsg.edit({ embed: errorDB, component: [] });
                        });
                    }
                    if (pm.id === "pManage") {
                      await panelmsg.edit({ embed: loading, component: [] });
                      await wait(1500);
                      const Client = new node.NodeactylClient(
                        fpanel[0].URL,
                        fpanel[0].API
                      );
                      Client.getAllServers()
                        .then((response) => {
                          let serverEmbed = new MessageEmbed();
                          serverEmbed.setColor(color);
                          serverEmbed.setTitle(serverTitle);
                          serverEmbed.setThumbnail(thumbnail);
                          serverEmbed.setFooter(footer);

                          if (response.length == 0) {
                            serverEmbed.setDescription(
                              "No servers were found on this pterodactyl account"
                            );
                            return panelmsg.edit(serverEmbed);
                          } else {
                            let anothertemp = [];
                            let servers;
                            response.data.map((S) => {
                              let name = S.attributes.name;
                              if (name.length > 50) name + "Name Limit";
                              let somemenu = new MessageMenuOption();
                              somemenu.setLabel(name);
                              somemenu.setValue(S.attributes.identifier);
                              somemenu.setDescription(
                                "Select this menu to manage this server"
                              );
                              anothertemp.push(somemenu);

                              const srv = S.attributes;

                              if (!servers)
                                return (servers =
                                  "**" +
                                  srv.name +
                                  "** [`" +
                                  srv.identifier +
                                  "`]\n```\nnode: " +
                                  srv.node +
                                  "\nip: " +
                                  srv.relationships.allocations.data[0]
                                    .attributes.ip +
                                  ":" +
                                  srv.relationships.allocations.data[0]
                                    .attributes.port +
                                  "\nSuspended: " +
                                  srv.is_suspended +
                                  "\nInstalling: " +
                                  srv.is_installing +
                                  "\n```\n");
                              servers =
                                servers +
                                "**" +
                                srv.name +
                                "** [`" +
                                srv.identifier +
                                "`]\n```\nnode: " +
                                srv.node +
                                "\nip: " +
                                srv.relationships.allocations.data[0].attributes
                                  .ip +
                                ":" +
                                srv.relationships.allocations.data[0].attributes
                                  .port +
                                "\nSuspended: " +
                                srv.is_suspended +
                                "\nInstalling: " +
                                srv.is_installing +
                                "\n```\n";
                            });
                            serverEmbed.setDescription(servers);

                            let anothermenu = new MessageMenu();
                            anothermenu.setID("menuagain");
                            anothermenu.addOption(closeMenu);
                            anothermenu.setPlaceholder("Select a server");
                            anothermenu.addOptions(anothertemp);

                            panelmsg.edit({
                              embed: serverEmbed,
                              component: anothermenu,
                            });

                            const filter = (button) =>
                              button.clicker.user.id === message.author.id;
                            const Panelcollector = panelmsg.createMenuCollector(
                              filter,
                              { max: 1, time: 30000 }
                            );
                            Panelcollector.on("collect", async (sm) => {
                              if (sm.values[0] === "close") {
                                panelmsg
                                  .edit({ embed: closeEmbed, component: [] })
                                  .then((msg) => {
                                    msg.delete({ timeout: 5000 });
                                  });
                              } else {
                                await panelmsg.edit({
                                  embed: loading,
                                  component: [],
                                });
                                await wait(1500);

                                try {
                                  const server = await Client.getServerDetails(
                                    sm.values[0]
                                  );
                                  const stats = await Client.getServerUsages(
                                    sm.values[0]
                                  );
                                  const account =
                                    await Client.getAccountDetails(
                                      fpanel[0].URL,
                                      fpanel[0].API
                                    );
                                  const status = stats.current_state;

                                  const currectStatus =
                                    "[Status: " + status + "]";
                                  let maxMemory = server.limits.memory;
                                  if (maxMemory === 0) maxMemory = "unlimited";
                                  if (maxMemory !== "unlimited")
                                    maxMemory = maxMemory + " MB";
                                  let maxDisk = server.limits.disk;
                                  if (maxDisk === 0) maxDisk = "unlimited";
                                  if (maxDisk !== "unlimited")
                                    maxDisk = maxDisk + " MB";
                                  let maxCPU = server.limits.cpu;
                                  if (maxCPU === 0) maxCPU = "unlimited";
                                  if (maxCPU !== "unlimited")
                                    maxCPU = maxCPU + "%";

                                  let currectMemory = formatBytes(
                                    stats.resources.memory_bytes
                                  );
                                  let currectDisk = formatBytes(
                                    stats.resources.disk_bytes
                                  );
                                  let currectCPU = stats.resources.cpu_absolute;

                                  let memory =
                                    "[Memory: " +
                                    currectMemory +
                                    "/" +
                                    maxMemory +
                                    "]";
                                  let disk =
                                    "[Disk: " +
                                    currectDisk +
                                    "/" +
                                    maxDisk +
                                    "]";
                                  let cpu =
                                    "[CPU: " + currectCPU + "%/" + maxCPU + "]";

                                  let currectDB = server.databases;
                                  if (`${currectDB}` === "undefined")
                                    currectDB = 0;
                                  let currectBK = server.backups;

                                  if (`${currectBK}` === "undefined")
                                    currectBK = 0;

                                  let databases =
                                    "[Databases: " +
                                    currectDB +
                                    "/" +
                                    server.feature_limits.databases +
                                    "]";
                                  let backups =
                                    "[Backups: " +
                                    currectBK +
                                    "/" +
                                    server.feature_limits.backups +
                                    "]";
                                  let allocations =
                                    "[Allocations: " +
                                    server.relationships.allocations.data
                                      .length +
                                    "/" +
                                    server.feature_limits.allocations +
                                    "]";

                                  let sftpLink =
                                    server.sftp_details.ip +
                                    ":" +
                                    server.sftp_details.port;
                                  let sftpUser =
                                    account.username + "." + server.identifier;

                                  const sftpEmbed = new MessageEmbed()
                                    .setTitle(serverTitle)
                                    .setColor(color)
                                    .setFooter(footer)
                                    .setDescription(
                                      "SFTP Details:\n```\nServer Address: " +
                                        sftpLink +
                                        "\nUsername: " +
                                        sftpUser +
                                        "\n```"
                                    );

                                  const serverSelected = new MessageEmbed()
                                    .setAuthor(serverTitle)
                                    .setTitle(
                                      "[Controling: " + server.name + "]"
                                    )
                                    .setColor(color)
                                    .setFooter(footer)
                                    .setDescription(
                                      "Server Resource:\n```\n" +
                                        currectStatus +
                                        "\n" +
                                        cpu +
                                        "\n" +
                                        memory +
                                        "\n" +
                                        disk +
                                        "\n```\nServer Feature:\n```\n" +
                                        databases +
                                        "\n" +
                                        backups +
                                        "\n" +
                                        allocations +
                                        "\n```"
                                    );

                                  const serverStart = new MessageButton();
                                  serverStart.setLabel("Start");
                                  serverStart.setStyle("blurple");
                                  serverStart.setID("start");

                                  const serverSFTP = new MessageButton()
                                    .setLabel("SFTP")
                                    .setStyle("blurple")
                                    .setID("sftp");

                                  const serverStop = new MessageButton();
                                  serverStop.setLabel("Stop");
                                  serverStop.setStyle("red");
                                  serverStop.setID("stop");

                                  const serverKill = new MessageButton();
                                  serverKill.setLabel("Kill");
                                  serverKill.setStyle("red");
                                  serverKill.setID("kill");

                                  const serverRestart = new MessageButton();
                                  serverRestart.setLabel("Restart");
                                  serverRestart.setStyle("blurple");
                                  serverRestart.setID("restart");

                                  const serverSend = new MessageButton();
                                  serverSend.setLabel("Send Command");
                                  serverSend.setStyle("blurple");
                                  serverSend.setID("send");

                                  const serverUser = new MessageButton();
                                  serverUser.setLabel("Subusers");
                                  serverUser.setStyle("blurple");
                                  serverUser.setID("user");
                                  //serverUser.setDisabled(true)

                                  const serverMnBkp = new MessageButton();
                                  serverMnBkp.setLabel("Backups");
                                  serverMnBkp.setStyle("blurple");
                                  serverMnBkp.setID("backup");
                                  //serverMnBkp.setDisabled(true)

                                  const serverInstal = new MessageButton();
                                  serverInstal.setLabel("Reinstall");
                                  serverInstal.setStyle("red");
                                  serverInstal.setID("install");

                                  const serverRename = new MessageButton()
                                    .setLabel("Rename")
                                    .setStyle("blurple")
                                    .setID("rename");

                                  const serverStopped = new MessageEmbed()
                                    .setTitle(serverTitle)
                                    .setFooter(footer)
                                    .setColor(color)
                                    .setThumbnail(thumbnail)
                                    .setDescription(
                                      "Server succesfully stopped"
                                    );

                                  const serverKilled = new MessageEmbed()
                                    .setTitle(serverTitle)
                                    .setFooter(footer)
                                    .setColor(color)
                                    .setThumbnail(thumbnail)
                                    .setDescription(
                                      "Server succesfully killed"
                                    );

                                  const serverStarted = new MessageEmbed()
                                    .setTitle(serverTitle)
                                    .setFooter(footer)
                                    .setColor(color)
                                    .setThumbnail(thumbnail)
                                    .setDescription(
                                      "Server succesfully started"
                                    );

                                  const serverRestarted = new MessageEmbed()
                                    .setTitle(serverTitle)
                                    .setFooter(footer)
                                    .setColor(color)
                                    .setThumbnail(thumbnail)
                                    .setDescription(
                                      "Server succesfully restarted"
                                    );

                                  const serverReinstalled = new MessageEmbed()
                                    .setTitle(serverTitle)
                                    .setFooter(footer)
                                    .setColor(color)
                                    .setThumbnail(thumbnail)
                                    .setDescription(
                                      "Server succesfully reinstalled"
                                    );

                                  const serverSended = new MessageEmbed()
                                    .setTitle(serverTitle)
                                    .setFooter(footer)
                                    .setColor(color)
                                    .setThumbnail(thumbnail)
                                    .setDescription(
                                      "Command succesfully sended"
                                    );

                                  const userAdd = new MessageButton()
                                    .setLabel("New Subuser")
                                    .setStyle("blurple")
                                    .setID("newUser");

                                  const bkpAdd = new MessageButton()
                                    .setLabel("New Backup")
                                    .setStyle("blurple")
                                    .setID("newBkp");

                                  const userRow =
                                    new MessageActionRow().addComponents(
                                      userAdd,
                                      close
                                    );

                                  const bkpRow =
                                    new MessageActionRow().addComponents(
                                      bkpAdd,
                                      close
                                    );

                                  if (
                                    status === "running" ||
                                    status === "starting"
                                  ) {
                                    serverStart.setDisabled(true);

                                    const serverControl =
                                      new MessageActionRow().addComponents(
                                        serverStart,
                                        serverRestart,
                                        serverSend,
                                        serverStop,
                                        serverKill
                                      );

                                    const serverMngControl =
                                      new MessageActionRow().addComponents(
                                        serverSFTP,
                                        serverUser,
                                        serverMnBkp,
                                        serverRename,
                                        serverInstal
                                      );

                                    const closerow =
                                      new MessageActionRow().addComponent(
                                        close
                                      );

                                    panelmsg.edit({
                                      embed: serverSelected,
                                      components: [
                                        serverControl,
                                        serverMngControl,
                                        closerow,
                                      ],
                                    });

                                    const serverControlCollector =
                                      panelmsg.createButtonCollector(filter, {
                                        max: 1,
                                        time: 30000,
                                      });

                                    serverControlCollector.on(
                                      "collect",
                                      async (control) => {
                                        if (control.id === "start") {
                                          Client.startServer(sm.values[0]);
                                          panelmsg.edit({
                                            embed: serverStarted,
                                            components: [],
                                          });
                                        }
                                        if (control.id === "restart") {
                                          Client.restartServer(sm.values[0]);
                                          panelmsg.edit({
                                            embed: serverRestarted,
                                            components: [],
                                          });
                                        }
                                        if (control.id === "stop") {
                                          Client.stopServer(sm.values[0]);
                                          panelmsg.edit({
                                            embed: serverStopped,
                                            components: [],
                                          });
                                        }
                                        if (control.id === "kill") {
                                          Client.killServer(sm.values[0]);
                                          panelmsg.edit({
                                            embed: serverKilled,
                                            components: [],
                                          });
                                        }
                                        if (control.id === "send") {
                                          const editm = new MessageEmbed()
                                            .setTitle(panelTitle)
                                            .setFooter(footer)
                                            .setColor(color)
                                            .setThumbnail(thumbnail)
                                            .setDescription(
                                              "Please send a message for the command to be sent to the server"
                                            );

                                          panelmsg.edit({
                                            embed: editm,
                                            component: [],
                                          });

                                          await message.channel
                                            .awaitMessages(
                                              (m) =>
                                                m.author.id ==
                                                message.author.id,
                                              { max: 1, time: 30000 }
                                            )
                                            .then(async (collected) => {
                                              let newcontent = collected
                                                .first()
                                                .content.trim();

                                              await Client.sendServerCommand(
                                                sm.values[0],
                                                newcontent
                                              );
                                              panelmsg.edit({
                                                embed: serverSended,
                                                component: [],
                                              });
                                              collected.first().delete();
                                            })
                                            .catch((error) => {
                                              message.channel.send("no answer");
                                            });
                                        }
                                        if (control.id === "install") {
                                          Client.reInstallServer(sm.values[0]);
                                          panelmsg.edit({
                                            embed: serverReinstalled,
                                            components: [],
                                          });
                                        }
                                        if (control.id === "sftp") {
                                          panelmsg.delete();
                                          control.reply.send({
                                            embed: sftpEmbed,
                                            ephemeral: true,
                                          });
                                        }
                                        if (control.id === "user") {
                                          Client.getSubUsers(sm.values[0]).then(
                                            (users) => {
                                              console.log(users);
                                              let embedDesc;
                                              const usrEmbed =
                                                new MessageEmbed()
                                                  .setColor(color)
                                                  .setTitle(serverTitle)
                                                  .setFooter(footer)
                                                  .setThumbnail(thumbnail);

                                              if (users.length === 0) {
                                                usrEmbed.setDescription(
                                                  "There is no subuser n this server"
                                                );
                                                return panelmsg.edit({
                                                  embed: usrEmbed,
                                                  component: userRow,
                                                });
                                              }

                                              users.forEach((usr) => {
                                                let user = usr.attributes;
                                                if (!embedDesc)
                                                  return (embedDesc =
                                                    "**" +
                                                    user.username +
                                                    "**\n```\nUUID: " +
                                                    user.uuid +
                                                    "\nCreated At: " +
                                                    user.created_at +
                                                    "\n```\n");
                                                embedDesc =
                                                  embedDesc +
                                                  "**" +
                                                  user.username +
                                                  "**\n```\nUUID: " +
                                                  user.uuid +
                                                  "\nCreated At: " +
                                                  user.created_at +
                                                  "\n```\n";
                                              });
                                              usrEmbed.setDescription(
                                                embedDesc
                                              );
                                              panelmsg.edit({
                                                embed: usrEmbed,
                                                component: userRow,
                                              });
                                              const serverBkpUsrCollector =
                                                panelmsg.createButtonCollector(
                                                  filter,
                                                  { max: 1, time: 30000 }
                                                );

                                              serverBkpUsrCollector.on(
                                                "collect",
                                                async (bs) => {
                                                  if (bs.id === "close") {
                                                    panelmsg
                                                      .edit({
                                                        embed: closeEmbed,
                                                        component: [],
                                                      })
                                                      .then((msg) => {
                                                        msg.delete({
                                                          timeout: 5000,
                                                        });
                                                      });
                                                  }
                                                  if (bs.id === "newUser") {
                                                    const embedUser =
                                                      new MessageEmbed()
                                                        .setColor(color)
                                                        .setTitle(serverTitle)
                                                        .setFooter(footer)
                                                        .setThumbnail(thumbnail)
                                                        .setDescription(
                                                          "Please send email of the user"
                                                        );

                                                    panelmsg.edit({
                                                      embed: embedUser,
                                                      component: null,
                                                    });
                                                    const embedAdded =
                                                      new MessageEmbed()
                                                        .setColor(color)
                                                        .setTitle(serverTitle)
                                                        .setFooter(footer)
                                                        .setThumbnail(thumbnail)
                                                        .setDescription(
                                                          "User added!, for security reason user added by this bot will only has start, restart, and stop permission"
                                                        );

                                                    await message.channel
                                                      .awaitMessages(
                                                        (m) =>
                                                          m.author.id ==
                                                          message.author.id,
                                                        { max: 1, time: 30000 }
                                                      )
                                                      .then(
                                                        async (collected) => {
                                                          let newcontent =
                                                            collected
                                                              .first()
                                                              .content.trim();

                                                          const evalid =
                                                            /[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+/;
                                                          const check =
                                                            evalid.test(
                                                              newcontent
                                                            );

                                                          if (check === false)
                                                            return panelmsg.edit(
                                                              {
                                                                content:
                                                                  "invalid email",
                                                                embed: null,
                                                                component: [],
                                                              }
                                                            );

                                                          Client.createSubUser(
                                                            sm.values[0],
                                                            newcontent,
                                                            [
                                                              "control.start",
                                                              "control.restart",
                                                              "control.stop",
                                                            ]
                                                          );
                                                          panelmsg.edit({
                                                            embed: embedAdded,
                                                            component: [],
                                                          });
                                                          collected
                                                            .first()
                                                            .delete();
                                                        }
                                                      )
                                                      .catch((error) => {
                                                        console.log(error);
                                                        message.channel.send(
                                                          "no answer"
                                                        );
                                                      });
                                                  }
                                                }
                                              );
                                            }
                                          );
                                        }
                                        if (control.id === "backup") {
                                          Client.listServerBackups(
                                            sm.values[0]
                                          ).then((bkps) => {
                                            console.log(bkps);
                                            let embedDesc;
                                            const usrEmbed = new MessageEmbed()
                                              .setColor(color)
                                              .setTitle(serverTitle)
                                              .setFooter(footer)
                                              .setThumbnail(thumbnail);

                                            if (bkps.length === 0) {
                                              usrEmbed.setDescription(
                                                "There is no backup on this server"
                                              );
                                              return panelmsg.edit({
                                                embed: usrEmbed,
                                                component: bkpRow,
                                              });
                                            }

                                            bkps.forEach((usr) => {
                                              let user = usr.attributes;
                                              if (!embedDesc)
                                                return (embedDesc =
                                                  "**" +
                                                  user.name +
                                                  "**\n```\nUUID: " +
                                                  user.uuid +
                                                  "\nSuccess: " +
                                                  user.is_successful +
                                                  "\nSize: " +
                                                  formatBytes(user.bytes) +
                                                  "\nCreated At: " +
                                                  user.created_at +
                                                  "\n```\n");
                                              embedDesc =
                                                embedDesc +
                                                "**" +
                                                user.name +
                                                "**\n```\nUUID: " +
                                                user.uuid +
                                                "\nSuccess: " +
                                                user.is_successful +
                                                "\nSize: " +
                                                formatBytes(user.bytes) +
                                                "\nCreated At: " +
                                                user.created_at +
                                                "\n```\n";
                                            });
                                            usrEmbed.setDescription(embedDesc);
                                            panelmsg.edit({
                                              embed: usrEmbed,
                                              component: bkpRow,
                                            });
                                            const serverBkpUsrCollector =
                                              panelmsg.createButtonCollector(
                                                filter,
                                                { max: 1, time: 30000 }
                                              );

                                            serverBkpUsrCollector.on(
                                              "collect",
                                              async (bs) => {
                                                if (bs.id === "close") {
                                                  panelmsg
                                                    .edit({
                                                      embed: closeEmbed,
                                                      component: [],
                                                    })
                                                    .then((msg) => {
                                                      msg.delete({
                                                        timeout: 5000,
                                                      });
                                                    });
                                                }
                                                if (bs.id === "newBkp") {
                                                  const sucBkp =
                                                    new MessageEmbed()
                                                      .setTitle(serverTitle)
                                                      .setFooter(footer)
                                                      .setThumbnail(thumbnail)
                                                      .setColor(color);

                                                  Client.createServerBackup(
                                                    sm.values[0]
                                                  )
                                                    .then((done) => {
                                                      sucBkp.setDescription(
                                                        "Successfuly created backup for your server!"
                                                      );
                                                      panelmsg.edit({
                                                        embed: sucBkp,
                                                        component: null,
                                                      });
                                                    })
                                                    .catch((error) => {
                                                      if (error === 924) {
                                                        sucBkp.setDescription(
                                                          "You need to wait 10 minutes to create another backup"
                                                        );
                                                        panelmsg.edit({
                                                          embed: sucBkp,
                                                          component: null,
                                                        });
                                                      }
                                                    });
                                                }
                                              }
                                            );
                                          });
                                        }
                                        if (control.id === "rename") {
                                          const embedUser = new MessageEmbed()
                                            .setColor(color)
                                            .setTitle(serverTitle)
                                            .setFooter(footer)
                                            .setThumbnail(thumbnail)
                                            .setDescription(
                                              "Please send a new name for this server"
                                            );

                                          panelmsg.edit({
                                            embed: embedUser,
                                            component: null,
                                          });
                                          const embedAdded = new MessageEmbed()
                                            .setColor(color)
                                            .setTitle(serverTitle)
                                            .setFooter(footer)
                                            .setThumbnail(thumbnail)
                                            .setDescription(
                                              "Server new name has been seted"
                                            );

                                          await message.channel
                                            .awaitMessages(
                                              (m) =>
                                                m.author.id ==
                                                message.author.id,
                                              { max: 1, time: 30000 }
                                            )
                                            .then(async (collected) => {
                                              let newcontent = collected
                                                .first()
                                                .content.trim();

                                              Client.renameServer(
                                                sm.values[0],
                                                newcontent
                                              );
                                              panelmsg.edit({
                                                embed: embedAdded,
                                                component: [],
                                              });
                                              collected.first().delete();
                                            })
                                            .catch((error) => {
                                              console.log(error);
                                              message.channel.send("no answer");
                                            });
                                        }
                                        if (control.id === "close") {
                                          panelmsg.edit({
                                            embed: closeEmbed,
                                            components: [],
                                          });
                                        }
                                      }
                                    );
                                  } else if (
                                    status === "stopping" ||
                                    status === "offline"
                                  ) {
                                    serverStop.setDisabled(true);
                                    serverRestart.setDisabled(true);
                                    serverKill.setDisabled(true);
                                    serverSend.setDisabled(true);

                                    const serverControl =
                                      new MessageActionRow().addComponents(
                                        serverStart,
                                        serverRestart,
                                        serverSend,
                                        serverStop,
                                        serverKill
                                      );

                                    const serverMngControl =
                                      new MessageActionRow().addComponents(
                                        serverSFTP,
                                        serverUser,
                                        serverMnBkp,
                                        serverRename,
                                        serverInstal
                                      );

                                    const closerow =
                                      new MessageActionRow().addComponent(
                                        close
                                      );

                                    panelmsg.edit({
                                      embed: serverSelected,
                                      components: [
                                        serverControl,
                                        serverMngControl,
                                        closerow,
                                      ],
                                    });

                                    const serverControlCollector =
                                      panelmsg.createButtonCollector(filter, {
                                        max: 1,
                                        time: 30000,
                                      });

                                    serverControlCollector.on(
                                      "collect",
                                      async (control) => {
                                        if (control.id === "start") {
                                          Client.startServer(sm.values[0]);
                                          panelmsg.edit({
                                            embed: serverStarted,
                                            components: [],
                                          });
                                        }
                                        if (control.id === "restart") {
                                          Client.restartServer(sm.values[0]);
                                          panelmsg.edit({
                                            embed: serverRestarted,
                                            components: [],
                                          });
                                        }
                                        if (control.id === "stop") {
                                          Client.stopServer(sm.values[0]);
                                          panelmsg.edit({
                                            embed: serverStopped,
                                            components: [],
                                          });
                                        }
                                        if (control.id === "kill") {
                                          Client.killServer(sm.values[0]);
                                          panelmsg.edit({
                                            embed: serverKilled,
                                            components: [],
                                          });
                                        }
                                        if (control.id === "send") {
                                          const editm = new MessageEmbed()
                                            .setTitle(panelTitle)
                                            .setFooter(footer)
                                            .setColor(color)
                                            .setThumbnail(thumbnail)
                                            .setDescription(
                                              "Please send a message for the command to be sent to the server"
                                            );

                                          panelmsg.edit({
                                            embed: editm,
                                            component: [],
                                          });

                                          await message.channel
                                            .awaitMessages(
                                              (m) =>
                                                m.author.id ==
                                                message.author.id,
                                              { max: 1, time: 30000 }
                                            )
                                            .then(async (collected) => {
                                              let newcontent = collected
                                                .first()
                                                .content.trim();

                                              await Client.sendServerCommand(
                                                sm.values[0],
                                                newcontent
                                              );
                                              panelmsg.edit({
                                                embed: serverSended,
                                                component: [],
                                              });
                                              collected.first().delete();
                                            })
                                            .catch((error) => {
                                              message.channel.send("no answer");
                                            });
                                        }
                                        if (control.id === "install") {
                                          Client.reInstallServer(sm.values[0]);
                                          panelmsg.edit({
                                            embed: serverReinstalled,
                                            components: [],
                                          });
                                        }
                                        if (control.id === "sftp") {
                                          panelmsg.delete();
                                          control.reply.send({
                                            embed: sftpEmbed,
                                            ephemeral: true,
                                          });
                                        }
                                        if (control.id === "user") {
                                          Client.getSubUsers(sm.values[0]).then(
                                            (users) => {
                                              console.log(users);
                                              let embedDesc;
                                              const usrEmbed =
                                                new MessageEmbed()
                                                  .setColor(color)
                                                  .setTitle(serverTitle)
                                                  .setFooter(footer)
                                                  .setThumbnail(thumbnail);

                                              if (users.length === 0) {
                                                usrEmbed.setDescription(
                                                  "There is no subuser n this server"
                                                );
                                                return panelmsg.edit({
                                                  embed: usrEmbed,
                                                  component: userRow,
                                                });
                                              }

                                              users.forEach((usr) => {
                                                let user = usr.attributes;
                                                if (!embedDesc)
                                                  return (embedDesc =
                                                    "**" +
                                                    user.username +
                                                    "**\n```\nUUID: " +
                                                    user.uuid +
                                                    "\nCreated At: " +
                                                    user.created_at +
                                                    "\n```\n");
                                                embedDesc =
                                                  embedDesc +
                                                  "**" +
                                                  user.username +
                                                  "**\n```\nUUID: " +
                                                  user.uuid +
                                                  "\nCreated At: " +
                                                  user.created_at +
                                                  "\n```\n";
                                              });
                                              usrEmbed.setDescription(
                                                embedDesc
                                              );
                                              panelmsg.edit({
                                                embed: usrEmbed,
                                                component: userRow,
                                              });
                                              const serverBkpUsrCollector =
                                                panelmsg.createButtonCollector(
                                                  filter,
                                                  { max: 1, time: 30000 }
                                                );

                                              serverBkpUsrCollector.on(
                                                "collect",
                                                async (bs) => {
                                                  if (bs.id === "close") {
                                                    panelmsg
                                                      .edit({
                                                        embed: closeEmbed,
                                                        component: [],
                                                      })
                                                      .then((msg) => {
                                                        msg.delete({
                                                          timeout: 5000,
                                                        });
                                                      });
                                                  }
                                                  if (bs.id === "newUser") {
                                                    const embedUser =
                                                      new MessageEmbed()
                                                        .setColor(color)
                                                        .setTitle(serverTitle)
                                                        .setFooter(footer)
                                                        .setThumbnail(thumbnail)
                                                        .setDescription(
                                                          "Please send email of the user"
                                                        );

                                                    panelmsg.edit({
                                                      embed: embedUser,
                                                      component: null,
                                                    });
                                                    const embedAdded =
                                                      new MessageEmbed()
                                                        .setColor(color)
                                                        .setTitle(serverTitle)
                                                        .setFooter(footer)
                                                        .setThumbnail(thumbnail)
                                                        .setDescription(
                                                          "User added!, for security reason user added by this bot will only has start, restart, and stop permission"
                                                        );

                                                    await message.channel
                                                      .awaitMessages(
                                                        (m) =>
                                                          m.author.id ==
                                                          message.author.id,
                                                        { max: 1, time: 30000 }
                                                      )
                                                      .then(
                                                        async (collected) => {
                                                          let newcontent =
                                                            collected
                                                              .first()
                                                              .content.trim();

                                                          const evalid =
                                                            /[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+/;
                                                          const check =
                                                            evalid.test(
                                                              newcontent
                                                            );

                                                          if (check === false)
                                                            return panelmsg.edit(
                                                              {
                                                                content:
                                                                  "invalid email",
                                                                embed: null,
                                                                component: [],
                                                              }
                                                            );

                                                          Client.createSubUser(
                                                            sm.values[0],
                                                            newcontent,
                                                            [
                                                              "control.start",
                                                              "control.restart",
                                                              "control.stop",
                                                            ]
                                                          );
                                                          panelmsg.edit({
                                                            embed: embedAdded,
                                                            component: [],
                                                          });
                                                          collected
                                                            .first()
                                                            .delete();
                                                        }
                                                      )
                                                      .catch((error) => {
                                                        console.log(error);
                                                        message.channel.send(
                                                          "no answer"
                                                        );
                                                      });
                                                  }
                                                }
                                              );
                                            }
                                          );
                                        }
                                        if (control.id === "backup") {
                                          Client.listServerBackups(
                                            sm.values[0]
                                          ).then((bkps) => {
                                            console.log(bkps);
                                            let embedDesc;
                                            const usrEmbed = new MessageEmbed()
                                              .setColor(color)
                                              .setTitle(serverTitle)
                                              .setFooter(footer)
                                              .setThumbnail(thumbnail);

                                            if (bkps.length === 0) {
                                              usrEmbed.setDescription(
                                                "There is no backup on this server"
                                              );
                                              return panelmsg.edit({
                                                embed: usrEmbed,
                                                component: bkpRow,
                                              });
                                            }

                                            bkps.forEach((usr) => {
                                              let user = usr.attributes;
                                              if (!embedDesc)
                                                return (embedDesc =
                                                  "**" +
                                                  user.name +
                                                  "**\n```\nUUID: " +
                                                  user.uuid +
                                                  "\nSuccess: " +
                                                  user.is_successful +
                                                  "\nSize: " +
                                                  formatBytes(user.bytes) +
                                                  "\nCreated At: " +
                                                  user.created_at +
                                                  "\n```\n");
                                              embedDesc =
                                                embedDesc +
                                                "**" +
                                                user.name +
                                                "**\n```\nUUID: " +
                                                user.uuid +
                                                "\nSuccess: " +
                                                user.is_successful +
                                                "\nSize: " +
                                                formatBytes(user.bytes) +
                                                "\nCreated At: " +
                                                user.created_at +
                                                "\n```\n";
                                            });
                                            usrEmbed.setDescription(embedDesc);
                                            panelmsg.edit({
                                              embed: usrEmbed,
                                              component: bkpRow,
                                            });
                                            const serverBkpUsrCollector =
                                              panelmsg.createButtonCollector(
                                                filter,
                                                { max: 1, time: 30000 }
                                              );

                                            serverBkpUsrCollector.on(
                                              "collect",
                                              async (bs) => {
                                                if (bs.id === "close") {
                                                  panelmsg
                                                    .edit({
                                                      embed: closeEmbed,
                                                      component: [],
                                                    })
                                                    .then((msg) => {
                                                      msg.delete({
                                                        timeout: 5000,
                                                      });
                                                    });
                                                }
                                                if (bs.id === "newBkp") {
                                                  const sucBkp =
                                                    new MessageEmbed()
                                                      .setTitle(serverTitle)
                                                      .setFooter(footer)
                                                      .setThumbnail(thumbnail)
                                                      .setColor(color);

                                                  Client.createServerBackup(
                                                    sm.values[0]
                                                  )
                                                    .then((done) => {
                                                      sucBkp.setDescription(
                                                        "Successfuly created backup for your server!"
                                                      );
                                                      panelmsg.edit({
                                                        embed: sucBkp,
                                                        component: null,
                                                      });
                                                    })
                                                    .catch((error) => {
                                                      if (error === 924) {
                                                        sucBkp.setDescription(
                                                          "You need to wait 10 minutes to create another backup"
                                                        );
                                                        panelmsg.edit({
                                                          embed: sucBkp,
                                                          component: null,
                                                        });
                                                      }
                                                    });
                                                }
                                              }
                                            );
                                          });
                                        }
                                        if (control.id === "rename") {
                                          const embedUser = new MessageEmbed()
                                            .setColor(color)
                                            .setTitle(serverTitle)
                                            .setFooter(footer)
                                            .setThumbnail(thumbnail)
                                            .setDescription(
                                              "Please send a new name for this server"
                                            );

                                          panelmsg.edit({
                                            embed: embedUser,
                                            component: null,
                                          });
                                          const embedAdded = new MessageEmbed()
                                            .setColor(color)
                                            .setTitle(serverTitle)
                                            .setFooter(footer)
                                            .setThumbnail(thumbnail)
                                            .setDescription(
                                              "Server new name has been seted"
                                            );

                                          await message.channel
                                            .awaitMessages(
                                              (m) =>
                                                m.author.id ==
                                                message.author.id,
                                              { max: 1, time: 30000 }
                                            )
                                            .then(async (collected) => {
                                              let newcontent = collected
                                                .first()
                                                .content.trim();

                                              Client.renameServer(
                                                sm.values[0],
                                                newcontent
                                              );
                                              panelmsg.edit({
                                                embed: embedAdded,
                                                component: [],
                                              });
                                              collected.first().delete();
                                            })
                                            .catch((error) => {
                                              console.log(error);
                                              message.channel.send("no answer");
                                            });
                                        }
                                        if (control.id === "close") {
                                          panelmsg.edit({
                                            embed: closeEmbed,
                                            components: [],
                                          });
                                        }
                                      }
                                    );
                                  }
                                } catch (e) {
                                  let ErrCon = new MessageEmbed()
                                    .setTitle(
                                      "PteroControl ¦ Server Server Management"
                                    )
                                    .setThumbnail(client.user.avatarURL())
                                    .setColor(color)
                                    .setDescription(
                                      "An error just occurred please report this to our support server!"
                                    );

                                  let err305 = new MessageEmbed()
                                    .setTitle("PteroControl | Error 305")
                                    .setColor(color)
                                    .setDescription(
                                      "An error occured while fetching your servers. This can occur if your host has cloudflare enabled on their panel which will prevent the bot from connecting to the endpoints"
                                    )
                                    .setImage("https://http.cat/305");
                                  if (e === 305)
                                    return message.channel.send(err305);

                                  let err304 = new MessageEmbed()
                                    .setTitle("PteroControl | Error 304")
                                    .setColor(color)
                                    .setDescription(
                                      "An error occured while fetching your servers. This can occur if you put wrong apikeys, make sure the apikeys are client not admin"
                                    )
                                    .setImage("https://http.cat/304");
                                  if (e === 304)
                                    return message.channel.send(err304);

                                  let err344 = new MessageEmbed()
                                    .setTitle("PteroControl | Error 344")
                                    .setColor(color)
                                    .setDescription(
                                      "An error occured while fetching your servers. This can occur if the panel is down"
                                    )
                                    .setImage("https://http.cat/344");
                                  if (e === 344)
                                    return message.channel.send(err344);

                                  let err8 = new MessageEmbed()
                                    .setTitle(
                                      "PteroControl | Error 8",
                                      client.user.avatarURL()
                                    )
                                    .setColor(color)
                                    .setDescription(
                                      "An error occured while fetching your servers. This can occur if your put invalid website link"
                                    );
                                  if (e === 8)
                                    return message.channel.send(err8);

                                  let errNaN = new MessageEmbed()
                                    .setTitle(
                                      "PteroControl | Not a Pterodactyl Panel",
                                      client.user.avatarURL()
                                    )
                                    .setColor(color)
                                    .setDescription(
                                      "An error occured while fetching your servers. This can occur if you put website link that doesn't have pterodactyl panel"
                                    );
                                  if (`${e}` === "NaN")
                                    return message.channel.send(errNaN);

                                  let errorCODE = new MessageEmbed()
                                    .setTitle("PteroControl | Error!")
                                    .setDescription("Error Code " + e)
                                    .setFooter(footer)
                                    .setColor(color)

                                    .setImage("https://http.cat/" + e);
                                  console.log(e);

                                  panelmsg.edit({
                                    embed: errorCODE,
                                    component: Discord,
                                  });
                                }
                              }
                            });
                          }
                        })
                        .catch((e) => {
                          let ErrCon = new MessageEmbed()
                            .setTitle("PteroControl ¦ Server Server Management")
                            .setThumbnail(client.user.avatarURL())
                            .setColor(color)
                            .setDescription(
                              "An error just occurred please report this to our support server!"
                            );

                          let err305 = new MessageEmbed()
                            .setTitle("PteroControl | Error 305")
                            .setColor(color)
                            .setDescription(
                              "An error occured while fetching your servers. This can occur if your host has cloudflare enabled on their panel which will prevent the bot from connecting to the endpoints"
                            )
                            .setImage("https://http.cat/305");
                          if (e === 305) return message.channel.send(err305);

                          let err304 = new MessageEmbed()
                            .setTitle("PteroControl | Error 304")
                            .setColor(color)
                            .setDescription(
                              "An error occured while fetching your servers. This can occur if you put wrong apikeys, make sure the apikeys are client not admin"
                            )
                            .setImage("https://http.cat/304");
                          if (e === 304) return message.channel.send(err304);

                          let err344 = new MessageEmbed()
                            .setTitle("PteroControl | Error 344")
                            .setColor(color)
                            .setDescription(
                              "An error occured while fetching your servers. This can occur if the panel is down"
                            )
                            .setImage("https://http.cat/344");
                          if (e === 344) return message.channel.send(err344);

                          let err8 = new MessageEmbed()
                            .setTitle(
                              "PteroControl | Error 8",
                              client.user.avatarURL()
                            )
                            .setColor(color)
                            .setDescription(
                              "An error occured while fetching your servers. This can occur if your put invalid website link"
                            );
                          if (e === 8) return message.channel.send(err8);

                          let errNaN = new MessageEmbed()
                            .setTitle(
                              "PteroControl | Not a Pterodactyl Panel",
                              client.user.avatarURL()
                            )
                            .setColor(color)
                            .setDescription(
                              "An error occured while fetching your servers. This can occur if you put website link that doesn't have pterodactyl panel"
                            );
                          if (`${e}` === "NaN")
                            return message.channel.send(errNaN);

                          let errorCODE = new MessageEmbed()
                            .setTitle("PteroControl | Error!")
                            .setDescription("Error Code " + e)
                            .setImage("https://http.cat/" + e)
                            .setFooter(footer)
                            .setColor(color);

                          console.log(e);

                          panelmsg.edit({
                            embed: errorCODE,
                            component: Discord,
                          });
                        });
                    }
                  });
                });
            }
          });
        });
    })
    .catch((error) => {
      console.log(error);
      message.channel.send(errorDB);
    });
};

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 MB";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }