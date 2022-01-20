exports.run = (client, message, args) => {
  const { MessageEmbed } = require("discord.js");
  const {
    MessageButton,
    MessageActionRow,
    MessageMenu,
    MessageMenuOption,
  } = require("discord-buttons");
  const admin = require("../models/admin.js");
  const node = require("nodeactyl");
  const wait = require("util").promisify(setTimeout);
  const config = require("../config")

  let panelURL;
  let panelAPI;
  let panelNAME;

  let panelTitle = "PteroControl | Panel Management";
  let footer = "PteroControl For Pterodactyl 1.x";
  let color = "E5BE11";
  let thumbnail = client.user.avatarURL();
  const id = message.author.id;

  if (id !== "548867757517570058")
    return message.channel.send(
      "This command are on **Working In Progress** only bot owner can access it for now!"
    );

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

  admin
    .find({
      ids: id,
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
                                  admin
                                    .find({
                                      ids: id,
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
                                    const npanel = new admin({
                                      ids: id,
                                      API: panelAPI.trim(),
                                      URL: panelURL.trim(),
                                      NAME: panelNAME.trim(),
                                    });
                                    await npanel.save();
                                    c.send({ embed: reSucess });
                                    A;
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
                                admin
                                  .find({
                                    ids: id,
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
                                  const npanel = new admin({
                                    ids: id,
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
              admin
                .find({
                  ids: id,
                  NAME: m.values[0],
                })
                .then((fpanel) => {
                  const Admin = new node.NodeactylApplication(
                    fpanel[0].URL,
                    fpanel[0].API
                  );
                  const panelManage = new MessageEmbed()
                    .setTitle(panelTitle)
                    .setFooter(footer)
                    .setThumbnail(thumbnail)
                    .setColor(color)
                    .setDescription(
                      "Hey, what do you want to do with this " + m.values[0]
                    );

                  const pManage = new MessageButton()
                    .setLabel("Manage Panel")
                    .setStyle("blurple")
                    .setID("pManage");

                  const pUrl = new MessageButton()
                    .setLabel("URL")
                    .setStyle("blurple")
                    .setID("pUrl");

                  const manageServers = new MessageButton()
                    .setLabel("Servers")
                    .setStyle("blurple")
                    .setID("servers");

                  const manageNodes = new MessageButton()
                    .setLabel("Nodes")
                    .setStyle("blurple")
                    .setID("nodes");

                  const manageEggs = new MessageButton()
                    .setLabel("Eggs and Nests")
                    .setStyle("blurple")
                    .setID("eggs");

                  const manageUsers = new MessageButton()
                    .setLabel("Users")
                    .setStyle("blurple")
                    .setID("users");

                  const pDelete = new MessageButton()
                    .setLabel("Delete")
                    .setStyle("red")
                    .setID("pDelete");

                  const pEdit = new MessageButton()
                    .setLabel("Edit")
                    .setStyle("blurple")
                    .setID("pEdit");

                  const pManageRow = new MessageActionRow().addComponents(
                    pManage,
                    pEdit,
                    pUrl,
                    pDelete,
                    close
                  );
                  const manageRow = new MessageActionRow().addComponents(
                    manageServers,
                    manageUsers,
                    manageNodes,
                    manageEggs,
                    close
                  );

                  panelmsg.edit({
                    embed: panelManage,
                    components: [pManageRow],
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

                              admin
                                .find({
                                  ids: id,
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

                              admin
                                .findOneAndUpdate(
                                  {
                                    ids: id,
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

                              admin
                                .findOneAndUpdate(
                                  {
                                    ids: id,
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

                              admin
                                .findOneAndUpdate(
                                  {
                                    ids: id,
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

                      admin
                        .deleteOne({
                          ids: id,
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

                      const manageEmbed = new MessageEmbed()
                        .setTitle(panelTitle)
                        .setFooter(footer)
                        .setThumbnail(thumbnail)
                        .setColor(color)
                        .setDescription("Which options you want to manage?");
                      panelmsg.edit({
                        embed: manageEmbed,
                        component: manageRow,
                      });

                      const manageCollector = panelmsg.createButtonCollector(
                        filter,
                        { max: 1, time: 30000 }
                      );

                      manageCollector.on("collect", async (mc) => {
                        if (mc.id === "nodes") {
                        }
                        if (mc.id === "eggs") {
                          let temp;
                          axios(
                            fpanel[0].URL +
                              "api/application/nests?include=eggs",
                            {
                              method: "GET",
                              headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + fpanel[0].API,
                              },
                            }
                          ).then((nests) => {
                            nests.data.data.forEach((nest) => {
                              if (!temp) {
                                temp =
                                  "** " + nest.name + "**[`" + nest.id + "`]\n";
                                nest.attributes.relationships.eggs.data.forEach(
                                  (egg) => {
                                    if (
                                      nest.attributes.relationships.eggs.data
                                        .length === 0 ||
                                      !temp
                                    )
                                      return (temp = "-\n");
                                    if (
                                      nest.attributes.relationships.eggs.data
                                        .length === 0
                                    )
                                      return (temp = temp + "-\n");
                                    if (!temp)
                                      return (temp =
                                        "- ** " +
                                        egg.attributes.name +
                                        "**[`" +
                                        egg.attributes.id +
                                        "`]\n");
                                    temp =
                                      temp +
                                      "- ** " +
                                      egg.attributes.name +
                                      "**[`" +
                                      egg.attributes.id +
                                      "`]\n";
                                  }
                                );
                                return;
                              } else {
                                temp =
                                  temp +
                                  "** " +
                                  egg.attributes.name +
                                  "**[`" +
                                  egg.attributes.id +
                                  "`]\n";
                                nest.attributes.relationships.eggs.data.forEach(
                                  (egg) => {
                                    if (
                                      nest.attributes.relationships.eggs.data
                                        .length === 0 ||
                                      !temp
                                    )
                                      return (temp = "-\n");
                                    if (
                                      nest.attributes.relationships.eggs.data
                                        .length === 0
                                    )
                                      return (temp = temp + "-\n");
                                    if (!temp)
                                      return (temp =
                                        "- ** " +
                                        egg.attributes.name +
                                        "**[`" +
                                        egg.attributes.id +
                                        "`]\n");
                                    temp =
                                      temp +
                                      "- ** " +
                                      egg.attributes.name +
                                      "**[`" +
                                      egg.attributes.id +
                                      "`]\n";
                                  }
                                );
                              }
                            });
                            const embed = new MessageEmbed()
                              .setTitle(data.name + " > Eggs Management")
                              .setFooter(
                                "PteroAdmin (beta) For Pterodactyl 1.x"
                              )
                              .setThumbnail(client.user.avatarURL())
                              .setColor("E5BE11")
                              .setDescription(temp);
                            m.edit({
                              content: "",
                              embed: embed,
                              component: [],
                            });
                          });
                        }
                        const createdDone = new MessageEmbed()
                          .setTitle(panelTitle)
                          .setFooter(footer)
                          .setColor(color)
                          .setThumbnail(thumbnail)
                          .setDescription("Successfully created");

                        const actionCreate = new MessageButton()
                          .setLabel("Create")
                          .setStyle("blurple")
                          .setID("create");

                        const actionDelete = new MessageButton()
                          .setLabel("Delete")
                          .setStyle("red")
                          .setID("delete");

                        const actionEdit = new MessageButton()
                          .setLabel("Edit")
                          .setStyle("blurple")
                          .setID("edit");

                        const ManageRow = new MessageActionRow().addComponents(
                          actionCreate,
                          actionEdit,
                          actionDelete,
                          close
                        );

                        if (mc.id === "users") {
                          const usersManage = new MessageEmbed()
                            .setTitle(panelTitle)
                            .setFooter(footer)
                            .setColor(color)
                            .setThumbnail(thumbnail)
                            .setDescription(
                              "What you want to do with users management?"
                            );

                          panelmsg.edit({
                            embed: usersManage,
                            component: ManageRow,
                          });

                          const actionsCollector =
                            panelmsg.createButtonCollector(filter, {
                              max: 1,
                              time: 30000,
                            });

                          actionsCollector.on("collect", async (uc) => {
                            if (uc.id === "close") {
                              panelmsg
                                .edit({ embed: closeEmbed, component: [] })
                                .then((msg) => {
                                  msg.delete({ timeout: 5000 });
                                });
                            }
                            if (uc.id === "create") {
                              const editm = new MessageEmbed()
                                .setTitle(panelTitle)
                                .setFooter(footer)
                                .setColor(color)
                                .setThumbnail(thumbnail)
                                .setDescription(
                                  "Please send what the user name for this user"
                                );

                              panelmsg.edit({ embed: editm, component: [] });

                              await message.channel
                                .awaitMessages(
                                  (m) => m.author.id == message.author.id,
                                  { max: 1, time: 30000 }
                                )
                                .then(async (collected) => {
                                  let name = collected.first().content.trim();
                                  await message.channel
                                    .awaitMessages(
                                      (m) => m.author.id == message.author.id,
                                      { max: 1, time: 30000 }
                                    )
                                    .then(async (collected) => {
                                      let email = collected
                                        .first()
                                        .content.trim();

                                      Admin.createUser(
                                        name,
                                        email,
                                        name,
                                        name
                                      ).then((created) => {
                                        panelmsg.edit({
                                          embed: createdDone,
                                          component: null,
                                        });
                                      });
                                    })
                                    .catch((error) => {
                                      message.channel.send("no answer");
                                    });
                                })
                                .catch((error) => {
                                  message.channel.send("no answer");
                                });
                            }
                            if (uc.id === "edit") {
                            }
                            if (uc.id === "delete") {
                            }
                          });
                        }
                        if (mc.id === "servers") {
                          const serversManage = new MessageEmbed()
                            .setTitle(panelTitle)
                            .setFooter(footer)
                            .setColor(color)
                            .setThumbnail(thumbnail)
                            .setDescription(
                              "What you want to do with servers management?"
                            );

                          panelmsg.edit({
                            embed: serversManage,
                            component: ManageRow,
                          });

                          const actionsCollector =
                            panelmsg.createButtonCollector(filter, {
                              max: 1,
                              time: 30000,
                            });

                          actionsCollector.on("collect", (uc) => {
                            if (uc.id === "close") {
                              panelmsg
                                .edit({ embed: closeEmbed, component: [] })
                                .then((msg) => {
                                  msg.delete({ timeout: 5000 });
                                });
                            }
                          });
                        }
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
