const panel = require("../models/panel.js");

module.exports = (client) => {
  setInterval(() => {
    panel
      .find({})
      .then((total) => {
        let totals = total.length;
        client.user.setActivity(
          `-help | Managing ${totals} Panel's in ${client.guilds.cache.size} server's`,
          { type: "PLAYING" }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, 60000);

  console.log("=+=+=+=+=+=+=+=+=+=+=+=");
  console.log("Name: PteroControl");
  console.log("Version: Recoded V3");
  console.log("=+=+=+=+=+=+=+=+=+=+=+=");
};
